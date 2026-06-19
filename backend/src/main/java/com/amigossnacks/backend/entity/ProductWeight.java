package com.amigossnacks.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "product_weights")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductWeight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;

    @Column(nullable = false, length = 20)
    private String weight; // e.g., "250 Grams", "500 Grams", "1000 Grams"

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
}
