package com.codewithpcodes.smart.location;

import java.time.Instant;

public record LocationPingResponse(
        Long id,
        Instant time,
        Long vehicleId,
        Double lat,
        Double lon,
        Double speedKmh,
        Double heading,
        Double accuracy
) {
    public static LocationPingResponse fromLocationPing(LocationPing locationPing) {
        return new LocationPingResponse(
                locationPing.getId(),
                locationPing.getTime(),
                locationPing.getVehicle().getId(),
                locationPing.getLat(),
                locationPing.getLon(),
                locationPing.getSpeedKmh(),
                locationPing.getHeading(),
                locationPing.getAccuracy()
        );
    }
}
