package com.codewithpcodes.smart.vehicle;

import java.time.Instant;

public record VehicleResponse(
        Long id,
        String plateNumber,
        String make,
        String model,
        VehicleCategory category,
        Double lat,
        Double lon,
        Instant positionUpdatedAt,
        String ownerName
) {
    public static VehicleResponse fromVehicle(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getPlateNumber(),
                vehicle.getMake(),
                vehicle.getModel(),
                vehicle.getVehicleCategory(),
                vehicle.getCurrentPosition().getX(),
                vehicle.getCurrentPosition().getY(),
                vehicle.getPositionUpdatedAt(),
                vehicle.getOwner().getFullName()
        );
    }
}
