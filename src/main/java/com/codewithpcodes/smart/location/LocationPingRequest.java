package com.codewithpcodes.smart.location;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record LocationPingRequest(

        @NotNull(message = "Latitude is required")
        @DecimalMin(value = "-90", message = "Latitude must be between -90 and 90")
        @DecimalMax(value = "90", message = "Latitude must be between -90 and 90")
        Double lat,
        @NotNull(message = "Longitude is required")
        @DecimalMax(value = "180", message = "Longitude must be between -180 and 180" )
        @DecimalMin(value = "-180", message = "Longitude must be between -180 and 180" )
        Double lon,

        Double speedKmh,
        Double heading,
        Double accuracy
) {
}
