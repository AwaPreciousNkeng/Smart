package com.codewithpcodes.smart.location;

import jakarta.validation.constraints.NotNull;

public record LocationPingRequest(

        @NotNull
        Double lat,
        @NotNull
        Double lon,
        Double speedKmh,
        Double heading,
        Double accuracy
) {
}
