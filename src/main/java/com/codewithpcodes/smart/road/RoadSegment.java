package com.codewithpcodes.smart.road;

import com.codewithpcodes.smart.zone.Zone;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.LineString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "cameroon")
public class RoadSegment {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "geom", nullable = false,
            columnDefinition = "geometry(LineString, 4326)")
    private LineString geom;

}
