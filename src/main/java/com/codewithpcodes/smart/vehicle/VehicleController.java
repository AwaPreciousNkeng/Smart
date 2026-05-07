package com.codewithpcodes.smart.vehicle;

import com.codewithpcodes.smart.location.LocationPingRequest;
import com.codewithpcodes.smart.location.LocationPingResponse;
import com.codewithpcodes.smart.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    @PreAuthorize("hasRole('User')")
    public ResponseEntity<VehicleResponse> registerVehicle(
            @Valid @RequestBody VehicleCreationRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(vehicleService.registerVehicle(request, currentUser));
    }

    @GetMapping()
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/my-vehicles")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<VehicleResponse>> getMyVehicles(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(vehicleService.getMyVehicles(currentUser));
    }

    @PatchMapping("/{id}/location")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<VehicleResponse> ping(
            @PathVariable long id,
            @Valid @RequestBody LocationPingRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(vehicleService.processPing(id, request, currentUser));
    }

    @GetMapping("/{id}/trail")
    public ResponseEntity<Page<LocationPingResponse>> getTrail(
            @PathVariable long id,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam(defaultValue = "100") int limit,
            @RequestParam(defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(vehicleService.getTrail(id, from, to, limit, page));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<VehicleResponse> updateVehicleStatus(
            @PathVariable long id,
            @RequestParam VehicleStatus status,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(vehicleService.updateVehicleStatus(id, status, currentUser));
    }
}
