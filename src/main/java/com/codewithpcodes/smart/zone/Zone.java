package com.codewithpcodes.smart.zone;

import com.codewithpcodes.smart.road.RoadSegment;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.locationtech.jts.geom.MultiPolygon;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "gadm")
public class Zone {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "name_1")
    private String region;

    @Column(name = "name_2")
    private String division;

    @Column(name = "name_3")
    private String subDivision;

    @Column(columnDefinition = "geometry(MultiPolygon, 4326)")
    private MultiPolygon geom;

}
