package com.amigossnacks.backend.repository;

import com.amigossnacks.backend.entity.Order;
import com.amigossnacks.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT o FROM Order o WHERE CAST(o.id AS string) LIKE %:query% OR LOWER(o.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY o.createdAt DESC")
    List<Order> searchOrders(@Param("query") String query);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    java.math.BigDecimal getTotalRevenue();
}
