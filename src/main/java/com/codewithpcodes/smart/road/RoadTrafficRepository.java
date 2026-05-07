package com.codewithpcodes.smart.road;

import com.codewithpcodes.smart.zone.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface RoadTrafficRepository extends JpaRepository<RoadTraffic, Long> {

    // ✅ Find traffic by road
    Optional<RoadTraffic> findBySegmentId(Integer segmentId);

    // ✅ Bulk fetch for map rendering
    List<RoadTraffic> findBySegmentIdIn(List<Integer> segmentIds);

    // ✅ Get recent updates
    List<RoadTraffic> findByTrafficLevelUpdatedAtAfter(Instant time);

    // ✅ Get traffic for a zone (via join)
    @Query("""
    SELECT t
    FROM RoadTraffic t
    JOIN t.segment r
    JOIN Zone z
        ON intersects(z.geom, r.geom) = true
    WHERE z = :zone
""")
    List<RoadTraffic> findByZone(@Param("zone") Zone zone);
}
