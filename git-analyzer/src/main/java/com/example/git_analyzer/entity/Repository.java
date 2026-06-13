package com.example.git_analyzer.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "repositories")
public class Repository {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "repo_url", nullable = false, length = 512)
    private String repoUrl;

    @Column(name = "repo_name")
    private String repoName;

    private String owner;

    private String status = "pending";

    // 🚀 1. Added a large text column to store Gemini's full markdown changelogs!
    @Column(name = "changelog", columnDefinition = "TEXT")
    private String changelog;

    @Column(name = "indexed_at")
    private LocalDateTime indexedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // --- GETTERS AND SETTERS ---

    // 🚀 2. Added Getter and Setter for the changelog field
    public String getChangelog() {
        return changelog;
    }

    public void setChangelog(String changelog) {
        // Automatically updates the index time when content arrives
        this.changelog = changelog;
        this.indexedAt = LocalDateTime.now(); 
    }

    public UUID getId() { 
        return id; 
    }
    
    public void setId(UUID id) { 
        this.id = id; 
    }

    public User getUser() { 
        return user; 
    }
    
    public void setUser(User user) { 
        this.user = user; 
    }

    public String getRepoUrl() { 
        return repoUrl; 
    }
    
    public void setRepoUrl(String repoUrl) { 
        this.repoUrl = repoUrl; 
    }

    public String getRepoName() { 
        return repoName; 
    }
    
    public void setRepoName(String repoName) { 
        this.repoName = repoName; 
    }

    public String getOwner() { 
        return owner; 
    }
    
    public void setOwner(String owner) { 
        this.owner = owner; 
    }

    public String getStatus() { 
        return status; 
    }
    
    public void setStatus(String status) { 
        this.status = status; 
    }

    public LocalDateTime getIndexedAt() { 
        return indexedAt; 
    }
    
    public void setIndexedAt(LocalDateTime indexedAt) { 
        this.indexedAt = indexedAt; 
    }

    public LocalDateTime getCreatedAt() { 
        return createdAt; 
    }
    
    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt; 
    }
}