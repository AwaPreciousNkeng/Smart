package com.codewithpcodes.smart.incident;

import com.codewithpcodes.smart.road.RoadSegment;
import com.codewithpcodes.smart.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "geometry(Point, 4326)")
    private Point location;

    private String locationName;
    @Enumerated(EnumType.STRING)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    private IncidentType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentStatus status = IncidentStatus.OPEN;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by", nullable = false)
    private User reportedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "segment_id")
    private RoadSegment segment;

    private String closingNote;
    @Builder.Default
    private LocalDateTime reportedAt = LocalDateTime.now();
    private LocalDateTime acknowledgedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;

    private List<String> incidentMediaUrls = new ArrayList<>();
}
