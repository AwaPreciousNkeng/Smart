package com.codewithpcodes.smart.road;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "road_traffic")
public class RoadTraffic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TrafficLevel level = TrafficLevel.LOW;

    private Instant trafficLevelUpdatedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "road_segment_id")
    private RoadSegment segment;
}
