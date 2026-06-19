package com.amigossnacks.backend.controller;

import com.amigossnacks.backend.dto.JwtAuthenticationResponse;
import com.amigossnacks.backend.dto.LoginRequest;
import com.amigossnacks.backend.dto.SignupRequest;
import com.amigossnacks.backend.entity.User;
import com.amigossnacks.backend.repository.UserRepository;
import com.amigossnacks.backend.security.JwtTokenProvider;
import com.amigossnacks.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            return ResponseEntity.ok(new JwtAuthenticationResponse(
                    jwt, 
                    userPrincipal.getId(), 
                    userPrincipal.getFullName(), 
                    userPrincipal.getEmail(), 
                    userPrincipal.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
            ));
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Bad Credentials");
            response.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Conflict");
            response.put("message", "Email address already in use!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        // Creating user's account
        User user = User.builder()
                .fullName(signupRequest.getFullName())
                .email(signupRequest.getEmail())
                .mobileNumber(signupRequest.getMobileNumber())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .role("USER") // Default role is USER
                .build();

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("success", "true");
        response.put("message", "User registered successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User session expired or unauthorized");
        }
        
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", userPrincipal.getId());
        userData.put("fullName", userPrincipal.getFullName());
        userData.put("email", userPrincipal.getEmail());
        userData.put("role", userPrincipal.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""));
        
        // Fetch remaining profile details like phone from DB
        userRepository.findById(userPrincipal.getId()).ifPresent(user -> {
            userData.put("mobileNumber", user.getMobileNumber());
            userData.put("createdAt", user.getCreatedAt());
        });

        return ResponseEntity.ok(userData);
    }
}
