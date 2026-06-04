package com.codewithpcodes.smart.zone;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/zones")
@RequiredArgsConstructor
@Tag(name = "Zone Management", description = "Zone Management Endpoints")
public class ZoneController {

    private final ZoneService zoneService;

    @GetMapping
    public ResponseEntity<List<ZoneResponse>> getAllZones() {
        return ResponseEntity.ok(zoneService.getAllZones());
    }

    @GetMapping("/{region}")
    public ResponseEntity<List<ZoneResponse>> getZonesByRegion(
            @PathVariable String region
    ) {
        return ResponseEntity.ok(zoneService.getZonesByRegion(region));
    }

    @GetMapping("/{division}")
    public ResponseEntity<List<ZoneResponse>> getZonesByDivision(@PathVariable String division) {
        return ResponseEntity.ok(zoneService.getZonesByDivision(division));
    }

    @GetMapping("/{subDivision}")
    public ResponseEntity<List<ZoneResponse>> getZonesBySubDivision(
            @PathVariable String subDivision
    ) {
        return ResponseEntity.ok(zoneService.getZonesBySubDivision(subDivision));
    }

    @GetMapping("/{zoneId}")
    public ResponseEntity<ZoneResponse> getZoneById(@PathVariable Integer zoneId) {
        return ResponseEntity.ok(zoneService.getZoneById(zoneId));
    }

    @GetMapping("/{zoneId}/map")
    public ResponseEntity<ZoneResponse> getZoneMap(
            @PathVariable("zoneId") Integer ZoneId
    ) {
        return ResponseEntity.ok(zoneService.getZoneMap(ZoneId));
    }
}
