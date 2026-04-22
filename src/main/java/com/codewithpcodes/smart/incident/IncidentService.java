package com.codewithpcodes.smart.incident;

import com.codewithpcodes.smart.road.RoadSegmentRepository;
import com.codewithpcodes.smart.road.RoadSegmentService;
import com.codewithpcodes.smart.seed.NominatimService;
import com.codewithpcodes.smart.user.User;
import com.codewithpcodes.smart.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final RoadSegmentRepository roadSegmentRepository;
    private final UserRepository userRepository;
    private final GeometryFactory geometryFactory;
    private final NominatimService nominatimService;

    public IncidentResponse reportIncident(CreateIncidentRequest request, User currentUser) {
        Incident incident = Incident.builder()
                .location(geometryFactory.createPoint(new Coordinate(request.lon(), request.lat())))
                .type(request.type())
                .severity(request.severity())
                .description(request.description())
                .status(IncidentStatus.OPEN)
                .reportedBy(currentUser)
                .reportedAt(LocalDateTime.now())
                .locationName(nominatimService.resolveRoadName(request.lat(), request.lon()))
                .build();
    }
}
