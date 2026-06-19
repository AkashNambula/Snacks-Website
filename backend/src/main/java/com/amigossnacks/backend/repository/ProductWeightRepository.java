package com.amigossnacks.backend.repository;

import com.amigossnacks.backend.entity.ProductWeight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductWeightRepository extends JpaRepository<ProductWeight, Long> {
}
