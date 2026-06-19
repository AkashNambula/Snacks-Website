package com.amigossnacks.backend.controller;

import com.amigossnacks.backend.dto.OrderStatusUpdateDto;
import com.amigossnacks.backend.dto.ProductDto;
import com.amigossnacks.backend.entity.Order;
import com.amigossnacks.backend.entity.Product;
import com.amigossnacks.backend.entity.User;
import com.amigossnacks.backend.repository.OrderRepository;
import com.amigossnacks.backend.repository.ProductRepository;
import com.amigossnacks.backend.repository.UserRepository;
import com.amigossnacks.backend.service.OrderService;
import com.amigossnacks.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    // 1. Dashboard Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalProducts", productRepository.count());
        
        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        
        return ResponseEntity.ok(stats);
    }

    // 2. User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search));
        }
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        if (user.getRole().equalsIgnoreCase("ADMIN")) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Unauthorized");
            response.put("message", "Cannot delete an Admin account");
            return ResponseEntity.badRequest().body(response);
        }
        
        userRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }

    // 3. Product Management
    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@Valid @RequestBody ProductDto productDto) {
        Product product = productService.addProduct(productDto);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> editProduct(@PathVariable Long id, @Valid @RequestBody ProductDto productDto) {
        Product product = productService.editProduct(id, productDto);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Product deleted successfully");
        return ResponseEntity.ok(response);
    }

    // 4. Order Management
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getOrders(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(orderService.searchOrders(search));
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateDto statusUpdateDto) {
        Order order = orderService.updateOrderStatus(id, statusUpdateDto.getStatus());
        return ResponseEntity.ok(order);
    }
}
