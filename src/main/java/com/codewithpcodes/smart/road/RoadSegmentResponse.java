package com.codewithpcodes.smart.road;


public record RoadSegmentResponse(
        Integer roadID,
        String name,
        String trafficLevel,
        Object geom
) {
}
