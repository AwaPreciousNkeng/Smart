package com.codewithpcodes.smart.location;

import com.codewithpcodes.smart.vehicle.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query(value = "select lp from location_ping lp " +
            "WHERE lp.vehicle_id = :vehicleId " +
            "and lp.time between :from and :to " +
            "order by lp.time DESC ",
            nativeQuery = true
    )
    Page<LocationPing> findByVehicleIdAndTimeBetweenOrderByTimeDesc(
            @Param("vehicleId") Long vehicleId,
            @Param("from") Instant from,
            @Param("to") Instant to,
            Pageable pageable
    );

    @Query(value = "SELECT lp FROM LocationPing lp " +
            "WHERE lp.vehicle.id = :vehicleId " +
            "ORDER BY lp.time DESC")
    Page<LocationPing> findByVehicleIdOrderByTimeDesc(Long vehicleId, Pageable pageable);

    @Query(value = "SELECT v FROM Vehicle v " +
            "WHERE v.status = VehicleStatus.EN_ROUTE " +
            "AND v.status <> VehicleStatus.OUT_OF_SERVICE " +
            "AND NOT EXISTS (SELECT lp FROM LocationPing lp " +
            "WHERE lp.vehicle = v AND lp.time >= :cutOff )")
    List<Vehicle> findVehiclesWithNoPingsSince(Instant cutOff);
}
