package com.helpdesk.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketRequest {

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    private String category;
    private String priority;
    private String createdBy;
    private String rootCause;
    private String rootCausePath;
    private Double aiConfidence;
    private String suggestedSolution;
}
