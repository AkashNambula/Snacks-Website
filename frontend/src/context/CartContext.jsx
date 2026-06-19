import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend or local storage
  const fetchCart = async () => {
    if (user) {
      setLoading(true);
      try {
        const response = await api.get('/api/cart');
        setCartItems(response.data);
      } catch (error) {
        console.error('Failed to fetch cart', error);
      } finally {
        setLoading(false);
      }
    } else {
      const localCart = localStorage.getItem('guest_cart');
      setCartItems(localCart ? JSON.parse(localCart) : []);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Sync guest cart to backend upon login
  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        const localCart = localStorage.getItem('guest_cart');
        if (localCart) {
          const items = JSON.parse(localCart);
          for (const item of items) {
            try {
              await api.post('/api/cart', {
                productId: item.product.id,
                weight: item.weight,
                quantity: item.quantity,
              });
            } catch (err) {
              console.error('Failed to sync guest cart item', err);
            }
          }
          localStorage.removeItem('guest_cart');
          fetchCart();
        }
      }
    };
    syncCart();
  }, [user]);

  const addToCart = async (product, weight, quantity) => {
    if (user) {
      try {
        await api.post('/api/cart', {
          productId: product.id,
          weight,
          quantity,
        });
        await fetchCart();
        return { success: true };
      } catch (error) {
        console.error('Failed to add to cart', error);
        return { success: false, error: 'Could not add item to cart.' };
      }
    } else {
      // Local cart logic for guest users
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => item.product.id === product.id && item.weight === weight
        );

        let newItems;
        if (existingIndex > -1) {
          newItems = [...prevItems];
          newItems[existingIndex].quantity += quantity;
        } else {
          // Mock cart item ID for guest items
          newItems = [
            ...prevItems,
            { id: Date.now(), product, weight, quantity },
          ];
        }
        localStorage.setItem('guest_cart', JSON.stringify(newItems));
        return newItems;
      });
      return { success: true };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    if (user) {
      try {
        await api.put(`/api/cart/${cartItemId}?quantity=${quantity}`);
        await fetchCart();
      } catch (error) {
        console.error('Failed to update quantity', error);
      }
    } else {
      setCartItems((prevItems) => {
        const newItems = prevItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        localStorage.setItem('guest_cart', JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (user) {
      try {
        await api.delete(`/api/cart/${cartItemId}`);
        await fetchCart();
      } catch (error) {
        console.error('Failed to remove from cart', error);
      }
    } else {
      setCartItems((prevItems) => {
        const newItems = prevItems.filter((item) => item.id !== cartItemId);
        localStorage.setItem('guest_cart', JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/api/cart/clear');
        setCartItems([]);
      } catch (error) {
        console.error('Failed to clear cart', error);
      }
    } else {
      localStorage.removeItem('guest_cart');
      setCartItems([]);
    }
  };

  // Helper function to get the current item price based on selected weight
  const getItemPrice = (item) => {
    const weights = item.product.weights || [];
    const matched = weights.find(w => w.weight === item.weight);
    return matched ? matched.price : 0;
  };

  // Calculate totals
  const cartTotal = cartItems.reduce((total, item) => {
    const price = getItemPrice(item);
    return total + (price * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        getItemPrice,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
