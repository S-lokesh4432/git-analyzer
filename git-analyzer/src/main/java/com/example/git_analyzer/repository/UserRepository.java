package com.example.git_analyzer.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.git_analyzer.entity.User;

public interface UserRepository extends JpaRepository<User, UUID> {
    // This helper method lets us look up a user by their Firebase Authentication ID instantly!
    Optional<User> findByFirebaseUid(String firebaseUid);
}