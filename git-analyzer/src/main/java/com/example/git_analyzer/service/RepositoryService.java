package com.example.git_analyzer.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.example.git_analyzer.entity.Repository;
import com.example.git_analyzer.entity.User;
import com.example.git_analyzer.repository.RepositoryMappingRepository;
import com.example.git_analyzer.repository.UserRepository;

@Service
public class RepositoryService {

    @Autowired
    private RepositoryMappingRepository repositoryMappingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestTemplate restTemplate;

    // 🚀 1. Dynamically read your clean deployment URL link out of your application.properties!
    @Value("${n8n.webhook.url}")
    private String n8nWebhookUrl;

    @Transactional
    public Repository triggerAnalysis(String repoUrl, String firebaseUid) {
        // 1. Fetch or create a fallback test user profile
        User user = userRepository.findByFirebaseUid(firebaseUid)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setFirebaseUid(firebaseUid);
                    newUser.setEmail("testuser@vit.ac.in");
                    newUser.setName("Lokesh S");
                    newUser.setPlan("free");
                    newUser.setReposUsedThisMonth(0);
                    newUser.setCreatedAt(LocalDateTime.now());
                    return userRepository.save(newUser);
                });

        // 2. Parse basic elements out of the GitHub string
        String owner = "Unknown";
        String repoName = "Unknown-Repo";
        try {
            if (repoUrl != null && repoUrl.contains("github.com/")) {
                String cleanedUrl = repoUrl.replace("https://github.com/", "")
                                           .replace("http://github.com/", "");
                String[] parts = cleanedUrl.split("/");
                if (parts.length >= 2) {
                    owner = parts[0];
                    repoName = parts[1].replace(".git", "");
                }
            }
        } catch (Exception e) {
            System.out.println("Could not parse GitHub URL elements, using defaults.");
        }

        // 3. Instantiate and persist the Repository entity tracking index
        Repository repo = new Repository();
        repo.setUser(user);
        repo.setRepoUrl(repoUrl);
        repo.setOwner(owner);
        repo.setRepoName(repoName);
        repo.setStatus("pending");
        repo.setCreatedAt(LocalDateTime.now());

        Repository savedRepo = repositoryMappingRepository.save(repo);
        System.out.println("Successfully registered repository mapping in DB with ID: " + savedRepo.getId());

        // 4. FIRE THE WEBHOOK TO THE RUNNING n8n ENGINE
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("repoId", savedRepo.getId().toString());
            payload.put("repoUrl", savedRepo.getRepoUrl());
            payload.put("owner", savedRepo.getOwner());
            payload.put("repoName", savedRepo.getRepoName());
            payload.put("firebaseUid", user.getFirebaseUid());

            System.out.println("Shooting JSON payload to n8n pipeline engine via URL: " + n8nWebhookUrl);
            
            // Fires an asynchronous-style background post request to the container
            new Thread(() -> {
                try {
                    restTemplate.postForLocation(n8nWebhookUrl, payload);
                    System.out.println("n8n background workflow triggered successfully!");
                } catch (Exception ex) {
                    System.err.println("Background n8n call error: " + ex.getMessage());
                }
            }).start();
            
            System.out.println("n8n workflow triggered successfully!");
        } catch (Exception e) {
            // If n8n isn't running or listening yet, we log a warning but don't crash Spring Boot
            System.err.println("WARNING: Could not connect to n8n webhook container. Is n8n active? Error: " + e.getMessage());
        }

        return savedRepo;
    }

    // 🚀 2. The callback handler method that n8n hits when Gemini finishes its compilation job!
    @Transactional
    public void updateChangelogAndStatus(UUID repoId, String changelog, String status) {
        Repository repo = repositoryMappingRepository.findById(repoId)
            .orElseThrow(() -> new RuntimeException("Repository entry record not found with ID: " + repoId));
        
        repo.setChangelog(changelog);
        repo.setStatus(status);
        
        repositoryMappingRepository.save(repo);
        System.out.println("Database record table updated successfully via incoming n8n webhook payload for ID: " + repoId);
    }
    @org.springframework.beans.factory.annotation.Autowired
    private com.example.git_analyzer.repository.RepositoryMappingRepository repositoryRepository; 
    // 💡 Note: Make sure the repository class name above matches your actual file name!

    public Repository findById(java.util.UUID id) {
        return repositoryRepository.findById(id).orElse(null);
    }
}