package com.amigossnacks.backend.controller;

import com.amigossnacks.backend.dto.CartItemRequest;
import com.amigossnacks.backend.entity.CartItem;
import com.amigossnacks.backend.entity.User;
import com.amigossnacks.backend.repository.UserRepository;
import com.amigossnacks.backend.security.UserPrincipal;
import com.amigossnacks.backend.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = getUser(userPrincipal);
        return ResponseEntity.ok(cartService.getCartItems(user));
    }

    @PostMapping
    public ResponseEntity<CartItem> addToCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CartItemRequest request) {
        User user = getUser(userPrincipal);
        CartItem cartItem = cartService.addToCart(user, request);
        return ResponseEntity.ok(cartItem);
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItem> updateCartQuantity(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        User user = getUser(userPrincipal);
        CartItem cartItem = cartService.updateCartQuantity(user, cartItemId, quantity);
        return ResponseEntity.ok(cartItem);
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeFromCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long cartItemId) {
        User user = getUser(userPrincipal);
        cartService.removeFromCart(user, cartItemId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Item removed from cart");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = getUser(userPrincipal);
        cartService.clearCart(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cart cleared successfully");
        return ResponseEntity.ok(response);
    }
}
