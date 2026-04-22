package com.codewithpcodes.smart.incident;

import java.time.LocalDateTime;

public record IncidentResponse(
        Long id,
        Double lat,
        Double lon,
        String locationName,
        IncidentType type,
        Severity severity,
        IncidentStatus status,
        String description,
        String reportedBy,
        String assignedTo,
        LocalDateTime reportedAt,
        LocalDateTime resolvedAt,
        String closingNote
) {

    public static IncidentResponse fromIncident(Incident incident) {
        return new IncidentResponse(
                incident.getId(),
                incident.getLocation().getY(),
                incident.getLocation().getX(),
                incident.getLocationName(),
                incident.getType(),
                incident.getSeverity(),
                incident.getStatus(),
                incident.getDescription(),
                incident.getReportedBy().getFullName(),
                incident.getAssignedTo().getFullName(),
                incident.getReportedAt(),
                incident.getResolvedAt(),
                incident.getClosingNote()
        );
    }
}
