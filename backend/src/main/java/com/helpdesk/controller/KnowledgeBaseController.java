package com.helpdesk.controller;

import com.helpdesk.model.KnowledgeArticle;
import com.helpdesk.service.KnowledgeBaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kb")
@RequiredArgsConstructor
public class KnowledgeBaseController {

    private final KnowledgeBaseService kbService;

    @GetMapping("/articles")
    public ResponseEntity<List<KnowledgeArticle>> getArticles(
            @RequestParam(required = false) String query,
            @RequestParam(required = false, defaultValue = "All") String category
    ) {
        return ResponseEntity.ok(kbService.getArticles(query, category));
    }

    @GetMapping("/articles/{id}")
    public ResponseEntity<KnowledgeArticle> getArticleById(@PathVariable String id) {
        return kbService.getArticleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/articles")
    public ResponseEntity<KnowledgeArticle> createArticle(@RequestBody KnowledgeArticle article) {
        return ResponseEntity.status(HttpStatus.CREATED).body(kbService.createArticle(article));
    }

    @PostMapping("/articles/{id}/like")
    public ResponseEntity<KnowledgeArticle> likeArticle(@PathVariable String id) {
        return ResponseEntity.ok(kbService.likeArticle(id));
    }

    @DeleteMapping("/articles/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable String id) {
        kbService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}
