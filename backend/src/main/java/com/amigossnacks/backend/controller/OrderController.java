package com.amigossnacks.backend.controller;

import com.amigossnacks.backend.dto.AddressDto;
import com.amigossnacks.backend.entity.Address;
import com.amigossnacks.backend.entity.Order;
import com.amigossnacks.backend.entity.User;
import com.amigossnacks.backend.repository.AddressRepository;
import com.amigossnacks.backend.repository.UserRepository;
import com.amigossnacks.backend.security.UserPrincipal;
import com.amigossnacks.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    private User getUser(UserPrincipal principal) {
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> placeOrder(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = getUser(userPrincipal);
        Order order = orderService.placeOrder(user);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrderHistory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = getUser(userPrincipal);
        return ResponseEntity.ok(orderService.getUserOrderHistory(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderDetails(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        User user = getUser(userPrincipal);
        return orderService.getOrderById(id, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/address")
    public ResponseEntity<Address> getAddress(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = getUser(userPrincipal);
        return addressRepository.findByUser(user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(new Address())); // Return empty address details
    }

    @PostMapping("/address")
    public ResponseEntity<Address> saveAddress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody AddressDto addressDto) {
        User user = getUser(userPrincipal);
        
        Address address = addressRepository.findByUser(user)
                .orElse(Address.builder().user(user).build());
        
        address.setAddress(addressDto.getAddress());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        address.setPincode(addressDto.getPincode());
        
        Address savedAddress = addressRepository.save(address);
        return ResponseEntity.ok(savedAddress);
    }
}
