package com.amigossnacks.backend.service;

import com.amigossnacks.backend.dto.CartItemRequest;
import com.amigossnacks.backend.entity.CartItem;
import com.amigossnacks.backend.entity.Product;
import com.amigossnacks.backend.entity.User;
import com.amigossnacks.backend.repository.CartRepository;
import com.amigossnacks.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<CartItem> getCartItems(User user) {
        return cartRepository.findByUser(user);
    }

    @Transactional
    public CartItem addToCart(User user, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        Optional<CartItem> existingItem = cartRepository.findByUserAndProductAndWeight(user, product, request.getWeight());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            return cartRepository.save(item);
        } else {
            CartItem cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .weight(request.getWeight())
                    .quantity(request.getQuantity())
                    .build();
            return cartRepository.save(cartItem);
        }
    }

    @Transactional
    public CartItem updateCartQuantity(User user, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized action on cart item");
        }

        if (quantity <= 0) {
            cartRepository.delete(cartItem);
            return null;
        }

        cartItem.setQuantity(quantity);
        return cartRepository.save(cartItem);
    }

    @Transactional
    public void removeFromCart(User user, Long cartItemId) {
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized action on cart item");
        }

        cartRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(User user) {
        List<CartItem> items = cartRepository.findByUser(user);
        cartRepository.deleteAll(items);
    }
}
