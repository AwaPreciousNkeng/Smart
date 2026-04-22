package com.codewithpcodes.smart.vehicle;

import jakarta.validation.constraints.NotBlank;

public record VehicleCreationRequest(

        @NotBlank(message = "Plate number is required")
        String plateNumber,

        @NotBlank(message = "Make is required")
        String make,

        @NotBlank(message = "Model is required")
        String model,

        VehicleCategory vehicleCategory


) {
}
