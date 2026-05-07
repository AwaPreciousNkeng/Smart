package com.codewithpcodes.smart.location;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.time.Instant;

@Embeddable
public class LocationPingId implements Serializable {
    private Long vehicleId;
    private Instant time;
}
