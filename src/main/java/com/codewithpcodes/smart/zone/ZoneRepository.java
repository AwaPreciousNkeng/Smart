package com.codewithpcodes.smart.zone;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZoneRepository extends JpaRepository<Zone, Integer> {
    List<Zone> findByRegion(String region);
    List<Zone> findByDivision(String division);
    List<Zone> findBySubDivision(String subDivision);
}
