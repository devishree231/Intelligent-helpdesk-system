package com.helpdesk.controller;

import com.helpdesk.dto.AIAnalysisResponse;
import com.helpdesk.service.AIServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIController {

    private final AIServiceClient aiServiceClient;

    @PostMapping("/analyze")
    public ResponseEntity<AIAnalysisResponse> analyzeIssue(@RequestBody Map<String, String> payload) {
        String subject = payload.getOrDefault("subject", "");
        String description = payload.getOrDefault("description", "");
        String ticketId = payload.get("ticketId");

        AIAnalysisResponse response = aiServiceClient.analyzeTicket(subject, description, ticketId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recommend-solution")
    public ResponseEntity<Map<String, Object>> recommendSolution(@RequestBody Map<String, String> payload) {
        String text = payload.getOrDefault("text", "");
        return ResponseEntity.ok(aiServiceClient.recommendSolutions(text));
    }
}
