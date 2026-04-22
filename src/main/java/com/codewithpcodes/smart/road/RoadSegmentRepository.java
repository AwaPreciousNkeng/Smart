package com.codewithpcodes.smart.road;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface RoadSegmentRepository extends JpaRepository<RoadSegment, Integer> {

    @Query(value = """
    SELECT r.*
    FROM cameroon r
    JOIN gadm z
    ON ST_Intersects(z.geom, r.geom)
    WHERE z.id = :zoneId
""", nativeQuery = true)
    List<RoadSegment> findRoadsInZone(@Param("zoneId") Integer zoneId);

    // Find all segments within a bounding box (for map rendering)
    @Query(value = """
            SELECT * FROM cameroon
            WHERE ST_Intersects(
                geom,
                ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326)
            )
            """, nativeQuery = true)
    List<RoadSegment> findWithinBoundingBox(
            @Param("minLon") double minLon,
            @Param("minLat") double minLat,
            @Param("maxLon") double maxLon,
            @Param("maxLat") double maxLat
    );

    // Find nearest road segment to a GPS point
    @Query(value = """
            SELECT * FROM cameroon
            ORDER BY geom <-> ST_SetSRID(ST_Point(:lon, :lat), 4326)
            LIMIT 1
            """, nativeQuery = true)
    Optional<RoadSegment> findNearestToPoint(
            @Param("lat") double lat,
            @Param("lon") double lon
    );

    @Query(value = "select  ST_Y(ST_LineInterpolatePoint(geom, 0.5)) as lat, " +
            "ST_X(ST_LineInterpolatePoint(geom, 0.5)) as lon " +
            "from cameroon where id = :id",
            nativeQuery = true
    )
    Map<String, Double> findMidPoint(@Param("id") Integer Id);
}
