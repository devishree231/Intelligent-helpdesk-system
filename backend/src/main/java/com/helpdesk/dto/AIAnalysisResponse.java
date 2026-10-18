package com.helpdesk.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIAnalysisResponse {

    @JsonProperty("ticket_id")
    private String ticketId;

    private String category;

    @JsonProperty("probable_root_cause")
    private String probableRootCause;

    @JsonProperty("root_cause_path")
    private String rootCausePath;

    @JsonProperty("predicted_priority")
    private String predictedPriority;

    @JsonProperty("suggested_solution")
    private String suggestedSolution;

    @JsonProperty("suggested_support_team")
    private String suggestedSupportTeam;

    @JsonProperty("confidence_score")
    private Double confidenceScore;

    @JsonProperty("similar_ticket_count")
    private Integer similarTicketCount;

    @JsonProperty("similar_tickets")
    private List<Map<String, Object>> similarTickets;
}
