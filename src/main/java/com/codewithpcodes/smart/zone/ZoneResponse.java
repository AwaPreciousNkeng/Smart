package com.codewithpcodes.smart.zone;

import com.codewithpcodes.smart.road.RoadSegmentResponse;

import java.util.List;

public record ZoneResponse(
        String region,
        String division,
        String subDivision,
        Object geom,
        List<RoadSegmentResponse> roads
) {

    public static ZoneResponse fromZone(Zone zone, List<RoadSegmentResponse> roads) {
        return new ZoneResponse(
                zone.getRegion(),
                zone.getDivision(),
                zone.getSubDivision(),
                zone.getGeom(),
                roads != null ? roads : List.of()
        );
    }
}
