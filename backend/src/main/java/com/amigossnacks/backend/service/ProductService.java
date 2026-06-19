package com.amigossnacks.backend.service;

import com.amigossnacks.backend.dto.ProductDto;
import com.amigossnacks.backend.dto.WeightPriceDto;
import com.amigossnacks.backend.entity.Product;
import com.amigossnacks.backend.entity.ProductWeight;
import com.amigossnacks.backend.repository.ProductRepository;
import com.amigossnacks.backend.repository.ProductWeightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductWeightRepository productWeightRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.findByProductNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }

    @Transactional
    public Product addProduct(ProductDto productDto) {
        Product product = Product.builder()
                .productName(productDto.getProductName())
                .description(productDto.getDescription())
                .imageUrl(productDto.getImageUrl())
                .category(productDto.getCategory())
                .weights(new ArrayList<>())
                .build();

        Product savedProduct = productRepository.save(product);

        if (productDto.getWeights() != null) {
            for (WeightPriceDto wp : productDto.getWeights()) {
                ProductWeight weight = ProductWeight.builder()
                        .product(savedProduct)
                        .weight(wp.getWeight())
                        .price(wp.getPrice())
                        .build();
                savedProduct.getWeights().add(productWeightRepository.save(weight));
            }
        }

        return productRepository.save(savedProduct);
    }

    @Transactional
    public Product editProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setProductName(productDto.getProductName());
        product.setDescription(productDto.getDescription());
        product.setImageUrl(productDto.getImageUrl());
        product.setCategory(productDto.getCategory());

        // Clear existing weights and add new ones
        product.getWeights().clear();
        productRepository.saveAndFlush(product); // force database synchronization

        if (productDto.getWeights() != null) {
            for (WeightPriceDto wp : productDto.getWeights()) {
                ProductWeight weight = ProductWeight.builder()
                        .product(product)
                        .weight(wp.getWeight())
                        .price(wp.getPrice())
                        .build();
                product.getWeights().add(productWeightRepository.save(weight));
            }
        }

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}
