package com.amigossnacks.backend.service;

import com.amigossnacks.backend.entity.*;
import com.amigossnacks.backend.repository.CartRepository;
import com.amigossnacks.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Transactional
    public Order placeOrder(User user) {
        List<CartItem> cartItems = cartRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cannot place order with an empty cart");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .user(user)
                .orderStatus("PENDING")
                .totalAmount(BigDecimal.ZERO)
                .build();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            
            // Find price for the selected weight
            ProductWeight weightConfig = product.getWeights().stream()
                    .filter(w -> w.getWeight().equalsIgnoreCase(cartItem.getWeight()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Pricing not configured for weight: " + cartItem.getWeight() + " on product: " + product.getProductName()));

            BigDecimal unitPrice = weightConfig.getPrice();
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .weight(cartItem.getWeight())
                    .price(unitPrice)
                    .build();

            orderItems.add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order.setOrderItems(orderItems);

        // Save order (cascades to orderItems)
        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }

    public List<Order> getUserOrderHistory(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Optional<Order> getOrderById(Long orderId, User user) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            // Allow if user is admin OR owns the order
            if (user.getRole().equalsIgnoreCase("ADMIN") || order.getUser().getId().equals(user.getId())) {
                return Optional.of(order);
            } else {
                throw new RuntimeException("Unauthorized to view this order");
            }
        }
        return Optional.empty();
    }

    // Admin Operations
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Order> searchOrders(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllOrders();
        }
        return orderRepository.searchOrders(query);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        order.setOrderStatus(status.toUpperCase());
        return orderRepository.save(order);
    }
}
