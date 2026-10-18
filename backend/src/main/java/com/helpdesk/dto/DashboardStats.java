package com.helpdesk.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long resolvedTickets;

    private String totalTrend;
    private String resolvedTrend;
    private String inProgressTrend;
    private String openTrend;

    private List<Map<String, Object>> categoryDistribution;
    private List<Map<String, Object>> weeklyTrend;
    private List<Map<String, Object>> priorityDistribution;
}
