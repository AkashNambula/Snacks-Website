package com.amigossnacks.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class WeightPriceDto {
    private String weight;
    private BigDecimal price;
}
