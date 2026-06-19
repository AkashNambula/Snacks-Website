import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShoppingCart, AlertCircle } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, getItemPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      // Redirect to login, adding a post-login redirect path
      navigate('/login?redirect=checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-brand-creamlight min-h-screen py-24 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-10 border border-brand-cream/30 text-center max-w-lg mx-auto shadow-sm flex flex-col items-center">
          <div className="bg-brand-cream/30 p-5 rounded-full mb-6">
            <ShoppingCart className="h-10 w-10 text-brand-light" />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-gray-400 mb-8 max-w-sm">
            It looks like you haven't added any Andhra snacks to your cart yet. Let's find some delicious items!
          </p>
          <Link
            to="/products"
            className="bg-brand-bronze hover:bg-brand-light text-white px-8 py-3.5 rounded-xl font-bold shadow-md shadow-brand-bronze/20 transition-all duration-200 flex items-center space-x-2"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Browse Snacks</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-creamlight min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-brand-dark mb-10">Your Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {!user && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 flex items-start space-x-3 text-xs font-semibold">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  You are shopping as a Guest. You can add items to your cart, but you will need to sign in or register to place your order. Your items will automatically sync to your account.
                </span>
              </div>
            )}

            {cartItems.map((item) => {
              const unitPrice = getItemPrice(item);
              const itemTotal = unitPrice * item.quantity;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-brand-cream/20 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-brand-cream transition-colors duration-200"
                >
                  {/* Product Details Link */}
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.productName}
                      className="w-20 h-20 rounded-xl object-cover bg-brand-cream/10 shrink-0 border border-brand-cream/30"
                    />
                    <div>
                      <Link
                        to={`/products/${item.product.id}`}
                        className="font-bold text-brand-dark hover:text-brand-bronze text-base transition-colors"
                      >
                        {item.product.productName}
                      </Link>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-bold text-brand-light bg-brand-cream/40 px-2 py-0.5 rounded">
                          {item.weight}
                        </span>
                        <span className="text-xs text-gray-400">
                          ₹{parseFloat(unitPrice).toFixed(2)} each
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Total controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-brand-cream/10">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-brand-creamlight/30">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded hover:bg-brand-cream text-brand-dark"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-4 font-bold text-sm text-brand-dark">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded hover:bg-brand-cream text-brand-dark"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right shrink-0">
                      <span className="text-lg font-extrabold text-brand-dark block">
                        ₹{itemTotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-full transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-3xl p-6 border border-brand-cream/30 shadow-sm">
            <h3 className="text-lg font-bold text-brand-dark mb-6 border-b border-brand-cream/20 pb-4">
              Order Summary
            </h3>

            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span className="font-semibold text-brand-dark">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping Fee</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Estimated Packaging Tax</span>
                <span className="font-semibold text-brand-dark">₹0.00</span>
              </div>
              
              <hr className="border-brand-cream/30" />
              
              <div className="flex justify-between text-base font-extrabold">
                <span className="text-brand-dark">Grand Total</span>
                <span className="text-xl text-brand-dark">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-brand-bronze hover:bg-brand-light text-white py-4 rounded-xl font-bold shadow-md shadow-brand-bronze/10 hover:shadow-brand-light/10 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              to="/products"
              className="block text-center text-xs text-brand-light font-bold hover:text-brand-dark mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
