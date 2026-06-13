package com.example.git_analyzer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class GitAnalyzerApplication {

    public static void main(String[] args) {
        SpringApplication.run(GitAnalyzerApplication.class, args);
    }

    // This Bean injects the HTTP client engine so our services can use it
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}