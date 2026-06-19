package com.amigossnacks.backend.dto;

import lombok.Data;

@Data
public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long id;
    private String fullName;
    private String email;
    private String role;

    public JwtAuthenticationResponse(String accessToken, Long id, String fullName, String email, String role) {
        this.accessToken = accessToken;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }
}
