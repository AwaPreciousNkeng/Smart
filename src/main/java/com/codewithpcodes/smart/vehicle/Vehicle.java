package com.codewithpcodes.smart.vehicle;

import com.codewithpcodes.smart.location.LocationPing;
import com.codewithpcodes.smart.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String plateNumber;

    private String make;
    private String model;

    @Enumerated(EnumType.STRING)
    private VehicleCategory vehicleCategory;

    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point currentPosition;

    private Instant positionUpdatedAt;

    @OneToMany(mappedBy = "vehicle")
    private List<LocationPing> locationPings;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

}
