package com.helpdesk.repository;

import com.helpdesk.model.KnowledgeArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeArticleRepository extends JpaRepository<KnowledgeArticle, String> {

    List<KnowledgeArticle> findByCategory(String category);

    @Query("SELECT k FROM KnowledgeArticle k WHERE " +
           "(:query IS NULL OR LOWER(k.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(k.content) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(k.tags) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR k.category = :category)")
    List<KnowledgeArticle> searchArticles(@Param("query") String query, @Param("category") String category);
}
