package com.amigossnacks.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductDto {
    private String productName;
    private String description;
    private String imageUrl;
    private String category;
    private List<WeightPriceDto> weights;
}
