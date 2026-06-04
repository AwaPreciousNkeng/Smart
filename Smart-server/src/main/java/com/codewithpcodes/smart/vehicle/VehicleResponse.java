package com.codewithpcodes.smart.vehicle;

import java.time.Instant;

public record VehicleResponse(
        Long id,
        String plateNumber,
        String make,
        String model,
        VehicleCategory category,
        VehicleStatus status,
        Double lat,
        Double lon,
        Instant positionUpdatedAt,
        String ownerName
) {
    public static VehicleResponse fromVehicle(Vehicle vehicle) {
        Double lat = null;
        Double lon = null;
        if (vehicle.getCurrentPosition() != null) {
            lat = vehicle.getCurrentPosition().getY();
            lon = vehicle.getCurrentPosition().getX();
        }
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getPlateNumber(),
                vehicle.getMake(),
                vehicle.getModel(),
                vehicle.getVehicleCategory(),
                vehicle.getStatus(),
                lat,
                lon,
                vehicle.getPositionUpdatedAt(),
                vehicle.getOwner().getFullName()
        );
    }
}