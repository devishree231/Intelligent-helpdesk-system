package com.helpdesk.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentRequest {

    @NotBlank(message = "Comment text is required")
    private String commentText;

    private String authorName;
    private String authorRole;
    private Boolean isAiGenerated;
}
