package com.codewithpcodes.smart.vehicle;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByOwnerId(Integer ownerId);
}
