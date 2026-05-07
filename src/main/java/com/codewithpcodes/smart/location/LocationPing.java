package com.codewithpcodes.smart.location;

import com.codewithpcodes.smart.vehicle.Vehicle;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(
        name = "location_ping",
        indexes = {
                @Index(name = "idx_location_ping_vehicle_time",
                        columnList = "vehicle_id, time")
        }
)

public class LocationPing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "time", nullable = false)
    private Instant time;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lon;

    private Double speedKmh;
    private Double heading;
    private Double accuracy;
}
