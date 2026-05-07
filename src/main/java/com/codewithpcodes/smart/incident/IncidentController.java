package com.codewithpcodes.smart.incident;

import com.codewithpcodes.smart.user.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/incidents")
@RequiredArgsConstructor
@Tag(name = "Incident Management", description = "Incident Management Endpoints")
public class IncidentController {

    private final IncidentService incidentService;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IncidentResponse> reportIncident(
            @Valid @RequestBody CreateIncidentRequest request,
            @RequestPart(name = "images", required = false) List<MultipartFile> images,
            @RequestPart(name = "videos", required = false) List<MultipartFile> videos,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(incidentService.reportIncident(request,images, videos, currentUser));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TRAFFIC_OFFICER', 'MINISTRY', 'ADMIN')")
    public ResponseEntity<List<IncidentResponse>> getAllActiveIncidents() {
        return ResponseEntity.ok(incidentService.getAllActive());
    }

    @GetMapping("/nearby")
    @PreAuthorize("hasAnyRole('TRAFFIC_OFFICER', 'ADMIN')")
    public ResponseEntity<List<IncidentResponse>> getNearbyIncidents(
            @RequestParam("lat") double lat,
            @RequestParam("lon") double lon,
            @RequestParam(defaultValue = "5000") double radius
    ) {
        return ResponseEntity.ok(incidentService.getNearBy(lat, lon, radius));
    }

    @GetMapping("/my-reported")
    public ResponseEntity<List<IncidentResponse>> getMyReportedIncidents(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(incidentService.getMyReported(currentUser.getId()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRAFFIC_OFFICER', 'MINISTRY', 'ADMIN')")
    public ResponseEntity<IncidentResponse> getIncidentById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(incidentService.getById(id));
    }

    @PatchMapping("/update")
    @PreAuthorize("hasRole('TRAFFIC_OFFICER')")
    public ResponseEntity<IncidentResponse> updateIncidentStatus(
            @Valid @RequestBody UpdateIncidentRequest request
    ) {
        return ResponseEntity.ok(incidentService.updateStatus(request));
    }
}