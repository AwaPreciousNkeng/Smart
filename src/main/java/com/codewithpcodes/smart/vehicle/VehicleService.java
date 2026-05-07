package com.codewithpcodes.smart.vehicle;

import com.codewithpcodes.smart.location.LocationPing;
import com.codewithpcodes.smart.location.LocationPingRepository;
import com.codewithpcodes.smart.location.LocationPingRequest;
import com.codewithpcodes.smart.location.LocationPingResponse;
import com.codewithpcodes.smart.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    public static final int IDLE_TIMEOUT_MINUTES = 2;

    private final VehicleRepository vehicleRepository;
    private final LocationPingRepository locationPingRepository;
    private final GeometryFactory geometryFactory;

    public VehicleResponse registerVehicle(VehicleCreationRequest request, User currentUser) {
        Vehicle vehicle = Vehicle.builder()
                .plateNumber(request.plateNumber())
                .make(request.make())
                .model(request.model())
                .vehicleCategory(request.vehicleCategory())
                .status(VehicleStatus.IDLE)
                .owner(currentUser)
                .build();
        return VehicleResponse.fromVehicle(vehicleRepository.save(vehicle));
    }

    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll()
                .stream()
                .map(VehicleResponse::fromVehicle)
                .toList();
    }

    public List<VehicleResponse> getMyVehicles(User currentUser) {
        return vehicleRepository.findByOwnerId(currentUser.getId())
                .stream()
                .map(VehicleResponse::fromVehicle)
                .toList();
    }

    @Transactional
    public VehicleResponse processPing(Long vehicleID, LocationPingRequest request, User currentUser) {
        Vehicle vehicle = vehicleRepository.findById(vehicleID)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found " + vehicleID));

        if (!vehicle.getOwner().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You do not own this vehicle.");
        }

        if (vehicle.getStatus() == VehicleStatus.OUT_OF_SERVICE) {
            throw new IllegalArgumentException("Cannot send pings for an out of service vehicle.");
        }

        LocationPing ping = LocationPing.builder()
                .time(Instant.now())
                .vehicle(vehicle)
                .lat(request.lat())
                .lon(request.lon())
                .speedKmh(request.speedKmh())
                .heading(request.heading())
                .accuracy(request.accuracy())
                .build();
        locationPingRepository.save(ping);

        Point point = geometryFactory.createPoint(new Coordinate(request.lon(), request.lat()));
        point.setSRID(4326);

        vehicle.setCurrentPosition(point);
        vehicle.setPositionUpdatedAt(Instant.now());

        if (vehicle.getStatus() == VehicleStatus.IDLE) {
            vehicle.setStatus(VehicleStatus.EN_ROUTE);
        }

        return VehicleResponse.fromVehicle(vehicleRepository.save(vehicle));
    }

    @Transactional
    public VehicleResponse updateVehicleStatus(Long vehicleID, VehicleStatus status, User currentUser) {
        Vehicle vehicle = vehicleRepository.findById(vehicleID)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found " + vehicleID));

        if (!vehicle.getOwner().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You do not own this vehicle.");
        }

        vehicle.setStatus(status);
        return VehicleResponse.fromVehicle(vehicleRepository.save(vehicle));
    }

    public Page<LocationPingResponse> getTrail(
            Long vehicleID,
            Instant from,
            Instant to,
            int limit,
            int page
    ) {
        vehicleRepository.findById(vehicleID)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found " + vehicleID));
        Pageable pageable = PageRequest.of(page, limit);
        Page<LocationPing> pings;
        if (from != null && to != null) {
            pings = locationPingRepository
                    .findByVehicleIdAndTimeBetweenOrderByTimeDesc(vehicleID, from, to, pageable);
        } else {
            pings = locationPingRepository.findByVehicleIdOrderByTimeDesc(vehicleID, pageable);
        }

        return pings.map(LocationPingResponse::fromLocationPing);
    }

    @Scheduled(fixedDelay = 60_000) //60 seconds
    @Transactional
    public void markStaleVehiclesIdle() {
        Instant cutOff = Instant.now().minus(IDLE_TIMEOUT_MINUTES, ChronoUnit.MINUTES);
        List<Vehicle> staleVehicles = locationPingRepository.findVehiclesWithNoPingsSince(cutOff);

        if (staleVehicles.isEmpty()) return;

        staleVehicles.forEach(v -> v.setStatus(VehicleStatus.IDLE));
        vehicleRepository.saveAll(staleVehicles);
    }
}
