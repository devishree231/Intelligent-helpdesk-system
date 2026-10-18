package com.helpdesk.service;

import com.helpdesk.dto.AIAnalysisResponse;
import com.helpdesk.dto.CommentRequest;
import com.helpdesk.dto.DashboardStats;
import com.helpdesk.dto.TicketRequest;
import com.helpdesk.model.Ticket;
import com.helpdesk.model.TicketComment;
import com.helpdesk.repository.TicketCommentRepository;
import com.helpdesk.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketCommentRepository commentRepository;
    private final AIServiceClient aiServiceClient;

    public Page<Ticket> getTickets(String query, String status, String category, String priority, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ticketRepository.searchTickets(
                (query != null && !query.trim().isEmpty()) ? query.trim() : null,
                (status != null && !status.equalsIgnoreCase("All")) ? status : null,
                (category != null && !category.equalsIgnoreCase("All")) ? category : null,
                (priority != null && !priority.equalsIgnoreCase("All")) ? priority : null,
                pageRequest
        );
    }

    public List<Ticket> getRecentTickets(int limit) {
        return ticketRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .limit(limit)
                .toList();
    }

    public Optional<Ticket> getTicketById(String id) {
        return ticketRepository.findById(id);
    }

    @Transactional
    public Ticket createTicket(TicketRequest request) {
        String generatedId = generateNextTicketId();

        // Perform AI Analysis for Category and Root-Cause Mapping
        AIAnalysisResponse aiAnalysis = aiServiceClient.analyzeTicket(
                request.getSubject(),
                request.getDescription(),
                generatedId
        );

        String category = (request.getCategory() != null && !request.getCategory().isEmpty())
                ? request.getCategory()
                : aiAnalysis.getCategory();

        String priority = (request.getPriority() != null && !request.getPriority().isEmpty())
                ? request.getPriority()
                : aiAnalysis.getPredictedPriority();

        String rootCause = (request.getRootCause() != null && !request.getRootCause().isEmpty())
                ? request.getRootCause()
                : aiAnalysis.getProbableRootCause();

        String rootCausePath = (request.getRootCausePath() != null && !request.getRootCausePath().isEmpty())
                ? request.getRootCausePath()
                : aiAnalysis.getRootCausePath();

        Double aiConfidence = (request.getAiConfidence() != null)
                ? request.getAiConfidence()
                : aiAnalysis.getConfidenceScore();

        String suggestedSolution = (request.getSuggestedSolution() != null && !request.getSuggestedSolution().isEmpty())
                ? request.getSuggestedSolution()
                : aiAnalysis.getSuggestedSolution();

        Ticket ticket = Ticket.builder()
                .id(generatedId)
                .subject(request.getSubject())
                .description(request.getDescription())
                .category(category)
                .rootCause(rootCause)
                .rootCausePath(rootCausePath)
                .priority(priority)
                .status("Open")
                .createdBy(request.getCreatedBy() != null ? request.getCreatedBy() : "Shreenithi")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .aiConfidence(aiConfidence)
                .suggestedSolution(suggestedSolution)
                .suggestedTeam(aiAnalysis.getSuggestedSupportTeam())
                .build();

        Ticket saved = ticketRepository.save(ticket);

        // Add initial AI automated insight comment
        if (suggestedSolution != null && !suggestedSolution.isEmpty()) {
            TicketComment aiComment = TicketComment.builder()
                    .ticket(saved)
                    .authorName("HelpDesk AI")
                    .authorRole("AI Assistant")
                    .commentText("AI Root-Cause Mapping: " + rootCausePath + " (" + (int)(aiConfidence * 100) + "% confidence). Suggested resolution: " + suggestedSolution)
                    .isAiGenerated(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            commentRepository.save(aiComment);
        }

        return saved;
    }

    @Transactional
    public Ticket updateTicketStatus(String id, String newStatus) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    @Transactional
    public Ticket assignTicket(String id, String assignee) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
        ticket.setAssignedTo(assignee);
        if ("Open".equalsIgnoreCase(ticket.getStatus())) {
            ticket.setStatus("In Progress");
        }
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    @Transactional
    public TicketComment addComment(String ticketId, CommentRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        TicketComment comment = TicketComment.builder()
                .ticket(ticket)
                .authorName(request.getAuthorName() != null ? request.getAuthorName() : "Shreenithi")
                .authorRole(request.getAuthorRole() != null ? request.getAuthorRole() : "Employee")
                .commentText(request.getCommentText())
                .isAiGenerated(Boolean.TRUE.equals(request.getIsAiGenerated()))
                .createdAt(LocalDateTime.now())
                .build();

        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        return commentRepository.save(comment);
    }

    public List<TicketComment> getComments(String ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    public DashboardStats getDashboardStats() {
        long total = ticketRepository.count();
        long open = ticketRepository.countByStatus("Open");
        long inProgress = ticketRepository.countByStatus("In Progress");
        long resolved = ticketRepository.countByStatus("Resolved");

        List<Object[]> catRows = ticketRepository.countTicketsByCategory();
        List<Map<String, Object>> catList = new ArrayList<>();
        for (Object[] row : catRows) {
            String cat = (String) row[0];
            long count = (Long) row[1];
            double pct = total > 0 ? (count * 100.0 / total) : 0;
            catList.add(Map.of(
                    "name", cat,
                    "count", count,
                    "percentage", Math.round(pct)
            ));
        }

        // 7 days trend
        List<Map<String, Object>> trend = List.of(
                Map.of("day", "Oct 9", "created", 6, "resolved", 5),
                Map.of("day", "Oct 10", "created", 6, "resolved", 5),
                Map.of("day", "Oct 11", "created", 7, "resolved", 4),
                Map.of("day", "Oct 12", "created", 6, "resolved", 4),
                Map.of("day", "Oct 13", "created", 6, "resolved", 4),
                Map.of("day", "Oct 14", "created", 7, "resolved", 5),
                Map.of("day", "Oct 15", "created", 8, "resolved", 6)
        );

        List<Map<String, Object>> priorityDist = List.of(
                Map.of("priority", "High", "count", 22, "percentage", 18),
                Map.of("priority", "Medium", "count", 56, "percentage", 45),
                Map.of("priority", "Low", "count", 46, "percentage", 37)
        );

        return DashboardStats.builder()
                .totalTickets(total)
                .openTickets(open)
                .inProgressTickets(inProgress)
                .resolvedTickets(resolved)
                .totalTrend("+ 12% from last week")
                .resolvedTrend("+ 20% from last week")
                .inProgressTrend("+ 17% from last week")
                .openTrend("- 25% from last week")
                .categoryDistribution(catList)
                .weeklyTrend(trend)
                .priorityDistribution(priorityDist)
                .build();
    }

    private synchronized String generateNextTicketId() {
        long count = ticketRepository.count();
        return String.format("#HD-%04d", 1000 + count + 1);
    }
}
