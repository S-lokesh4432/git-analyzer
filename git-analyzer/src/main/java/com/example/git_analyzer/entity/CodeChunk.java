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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "code_chunks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeChunk {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repo_id", referencedColumnName = "id")
    private Repository repository;

    @Column(nullable = false, length = 40)
    private String sha;

    @Column(nullable = false, length = 512)
    private String filename;

    @Column(name = "chunk_type", nullable = false, length = 50)
    private String chunkType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // We keep this as a float array since Hibernate maps VECTOR(1536) easily to it
    @Column(columnDefinition = "vector(1536)")
    private float[] embedding;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}