package com.codewithpcodes.smart.location;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface LocationPingRepository extends JpaRepository<LocationPing, Long> {
    @Query(value = "select * from location_ping " +
            "where vehicle_id = :vehicleId " +
            "order by time DESC " +
            "LIMIT :limit",
            nativeQuery = true)
    List<LocationPing> findRecentPings(
            @Param("vehicleId") Long vehicleId,
            @Param("limit") Integer limit
    );

    @Query(value = "select * from location_ping " +
            "WHERE vehicle_id = :vehicleId " +
            "and time between :from and :to " +
            "order by time",
            nativeQuery = true
    )
    List<LocationPing> findByVehicleAndTimeRange(
            @Param("vehicleId") Long vehicleId,
            @Param("from") Instant from,
            @Param("to") Instant to
    );
}
