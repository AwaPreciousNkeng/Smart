package com.codewithpcodes.smart.zone;

import com.codewithpcodes.smart.road.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ZoneService {

    private final ZoneRepository zoneRepository;
    private final RoadSegmentRepository roadSegmentRepository;
    private final RoadTrafficRepository roadTrafficRepository;
    private final RoadSegmentService roadSegmentService;

    public List<ZoneResponse> getAllZones() {
        return zoneRepository.findAll()
                .stream()
                .map(z -> ZoneResponse.fromZone(z, null))
                .toList();
    }

    public List<ZoneResponse> getZonesByRegion(String region) {
        return zoneRepository.findByRegion(region)
                .stream()
                .map(z -> ZoneResponse.fromZone(z, null))
                .toList();
    }

    public List<ZoneResponse> getZonesByDivision(String division) {
        return zoneRepository.findByDivision(division)
                .stream()
                .map(z -> ZoneResponse.fromZone(z, null))
                .toList();
    }

    public List<ZoneResponse> getZonesBySubDivision(String subDivision) {
        return zoneRepository.findBySubDivision(subDivision)
                .stream()
                .map(z -> ZoneResponse.fromZone(z, null))
                .toList();
    }

    public ZoneResponse getZoneById(Integer id) {
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Zone not found"));
        return ZoneResponse.fromZone(zone, null);
    }

    public ZoneResponse getZoneMap(Integer zoneId) {

        Zone zone = zoneRepository.findById(zoneId)
                .orElseThrow(() -> new IllegalArgumentException("Zone not found"));
        List<RoadSegment> roads = roadSegmentRepository.findRoadsInZone(zoneId);

        List<RoadSegmentResponse> roadResponse = roads
                .stream()
                .map(road -> {
                    RoadTraffic traffic = roadTrafficRepository
                            .findBySegmentId(road.getId())
                            .orElse(null);
                    return new RoadSegmentResponse(
                            road.getId(),
                            road.getName() != null
                                    ? road.getName()
                                    : roadSegmentService.getRoadNameFromLineString(road.getId()),
                            traffic != null
                            ? traffic.getLevel().name()
                            : "LOW",
                            road.getGeom()
                    );
                })
                .toList();

        return new ZoneResponse (
                zone.getRegion(),
                zone.getDivision(),
                zone.getSubDivision(),
                zone.getGeom(),
                roadResponse
        );
    }
}
