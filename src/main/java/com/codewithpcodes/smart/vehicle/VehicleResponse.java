package com.codewithpcodes.smart.vehicle;

import java.time.Instant;

public record VehicleResponse(
        String plateNumber,
        String make,
        VehicleCategory category,
        Double lat,
        Double lon,
        Instant positionUpdatedAt,
        String ownerName
) {
}
