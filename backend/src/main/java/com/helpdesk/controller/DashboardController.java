package com.helpdesk.controller;

import com.helpdesk.dto.DashboardStats;
import com.helpdesk.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final TicketService ticketService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(ticketService.getDashboardStats());
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getAnalyticsReports(@RequestParam(defaultValue = "7d") String period) {
        return ResponseEntity.ok(Map.of(
                "totalTickets", 124,
                "resolvedTickets", 98,
                "avgResolutionHours", 4.2,
                "csatScore", 4.6,
                "slaComplianceRate", 94.8,
                "ticketsByPriority", List.of(
                        Map.of("priority", "High", "count", 22, "percentage", 18),
                        Map.of("priority", "Medium", "count", 56, "percentage", 45),
                        Map.of("priority", "Low", "count", 46, "percentage", 37)
                ),
                "categoryDistribution", List.of(
                        Map.of("category", "IT Support", "count", 32),
                        Map.of("category", "Software Issue", "count", 28),
                        Map.of("category", "Hardware Issue", "count", 20),
                        Map.of("category", "Account Access", "count", 15),
                        Map.of("category", "Network", "count", 12),
                        Map.of("category", "Others", "count", 7)
                )
        ));
    }
}
