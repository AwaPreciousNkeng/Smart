package com.codewithpcodes.smart.incident;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateIncidentRequest(
        @NotNull(message = "Incident ID required")
        Long incidentId,
        @NotNull(message = "Incident status required")
        IncidentStatus status,
        @NotBlank(message = "Closing note required")
        String closingNote,
        @NotNull(message = "Officer ID required")
        Integer officerId
) {
}
