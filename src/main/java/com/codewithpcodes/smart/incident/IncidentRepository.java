package com.codewithpcodes.smart.incident;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    List<Incident> findByReportedById(Integer userId);

    List<Incident> findByAssignedToId(Integer officerId);

    List<Incident> findByStatusNotIn(List<IncidentStatus> statuses);

    @Query(value = "select * from incidents " +
            "where ST_DWITHIN(location::geography, ST_SetSRID(ST_Point(:lon, :lat), 4326)::geography, :radiusMetres) " +
            "and status not in ('CLOSED', 'RESOLVED') " +
            "order by reported_at desc", nativeQuery = true)
    List<Incident> findActiveNearPoint(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radiusMetres") double radiusMetres
    );
}
