package com.amigossnacks.backend.repository;

import com.amigossnacks.backend.entity.CartItem;
import com.amigossnacks.backend.entity.Product;
import com.amigossnacks.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProductAndWeight(User user, Product product, String weight);
    void deleteByUser(User user);
}
