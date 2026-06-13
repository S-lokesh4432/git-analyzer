package com.example.git_analyzer.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.git_analyzer.entity.Repository;
import com.example.git_analyzer.entity.User;

public interface RepositoryMappingRepository extends JpaRepository<Repository, UUID> {
    // This allows us to fetch only the repos that belong to a specific logged-in user!
    List<Repository> findByUser(User user);
}