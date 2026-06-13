    package com.example.git_analyzer.controller;

    import java.util.HashMap;
    import java.util.Map;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.CrossOrigin;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.git_analyzer.entity.Repository;
import com.example.git_analyzer.service.RepositoryService;

    @RestController
    @RequestMapping("/api/repositories")
    @CrossOrigin(origins = "*")
    public class RepositoryController {

        @Autowired
        private RepositoryService repositoryService;

        public static class AnalyzeRequest {    
            private String repoUrl;
            private String firebaseUid;

            public String getRepoUrl() { return repoUrl; }
            public void setRepoUrl(String repoUrl) { this.repoUrl = repoUrl; }
            public String getFirebaseUid() { return firebaseUid; }
            public void setFirebaseUid(String firebaseUid) { this.firebaseUid = firebaseUid; }
        }

        @PostMapping("/analyze")
        public ResponseEntity<Map<String, Object>> analyzeRepository(@RequestBody AnalyzeRequest request) {
            // Delegate all heavy lifting execution out to our new service layer!
            Repository analyzedRepo = repositoryService.triggerAnalysis(
                    request.getRepoUrl(), 
                    request.getFirebaseUid()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Repository pipeline initialized successfully.");
            response.put("repoId", analyzedRepo.getId());
            response.put("parsedName", analyzedRepo.getRepoName());
            response.put("currentStatus", analyzedRepo.getStatus());

            return ResponseEntity.ok(response);
        }
        @PostMapping("/update-changelog")
        public ResponseEntity<Map<String, Object>> updateChangelog(@RequestBody Map<String, Object> payload) {
            // Handle n8n field spelling ("repold") safely
            String repoIdStr = (String) payload.get("repoId");
            if (repoIdStr == null) {
                repoIdStr = (String) payload.get("repoId");
            }
            
            String changelog = (String) payload.get("changelog");

            if (repoIdStr == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "Missing repository ID key: 'repoId'");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            java.util.UUID repoId = java.util.UUID.fromString(repoIdStr);
            
            // Safely update our entity row
            repositoryService.updateChangelogAndStatus(repoId, changelog, "completed");

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Database record updated successfully by n8n pipeline.");
            return ResponseEntity.ok(response);
        }
            @org.springframework.web.bind.annotation.GetMapping("/status/{id}")
        public ResponseEntity<Map<String, Object>> getRepositoryStatus(@org.springframework.web.bind.annotation.PathVariable String id) {
            java.util.UUID repoId = java.util.UUID.fromString(id);
            Repository repo = repositoryService.findById(repoId);

            Map<String, Object> response = new HashMap<>();
            if (repo == null) {
                response.put("status", "error");
                response.put("message", "Repository not found.");
                return ResponseEntity.status(404).body(response);
            }

            // Return everything the React polling loop is looking for
            response.put("status", "success");
            response.put("currentStatus", repo.getStatus()); // e.g., "pending" or "completed"
            response.put("changelog", repo.getChangelog());  // The actual markdown text!

            return ResponseEntity.ok(response);
        }
    }