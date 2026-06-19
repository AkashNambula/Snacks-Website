package com.amigossnacks.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderStatusUpdateDto {
    @NotBlank(message = "Status cannot be blank")
    private String status;
}
