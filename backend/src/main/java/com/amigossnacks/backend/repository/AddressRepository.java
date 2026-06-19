package com.amigossnacks.backend.repository;

import com.amigossnacks.backend.entity.Address;
import com.amigossnacks.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByUser(User user);
}
