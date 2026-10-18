package com.helpdesk.service;

import com.helpdesk.model.KnowledgeArticle;
import com.helpdesk.repository.KnowledgeArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class KnowledgeBaseService {

    private final KnowledgeArticleRepository kbRepository;

    public List<KnowledgeArticle> getArticles(String query, String category) {
        if ((query == null || query.trim().isEmpty()) && (category == null || category.equalsIgnoreCase("All"))) {
            return kbRepository.findAll();
        }
        return kbRepository.searchArticles(
                (query != null && !query.trim().isEmpty()) ? query.trim() : null,
                (category != null && !category.equalsIgnoreCase("All")) ? category : null
        );
    }

    public Optional<KnowledgeArticle> getArticleById(String id) {
        Optional<KnowledgeArticle> article = kbRepository.findById(id);
        article.ifPresent(a -> {
            a.setViews(a.getViews() + 1);
            kbRepository.save(a);
        });
        return article;
    }

    @Transactional
    public KnowledgeArticle createArticle(KnowledgeArticle article) {
        if (article.getId() == null || article.getId().isEmpty()) {
            long count = kbRepository.count();
            article.setId("KB-" + (100 + count + 1));
        }
        return kbRepository.save(article);
    }

    @Transactional
    public KnowledgeArticle likeArticle(String id) {
        KnowledgeArticle article = kbRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found: " + id));
        article.setLikes(article.getLikes() + 1);
        return kbRepository.save(article);
    }

    @Transactional
    public void deleteArticle(String id) {
        kbRepository.deleteById(id);
    }
}
