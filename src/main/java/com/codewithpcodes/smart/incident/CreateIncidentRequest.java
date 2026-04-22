package com.codewithpcodes.smart.incident;

import jakarta.validation.constraints.NotNull;

public record CreateIncidentRequest(
        @NotNull
        Double lat,
        @NotNull
        Double lon,
        IncidentType type,
        Severity severity,
        String description
) {
}
