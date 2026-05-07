package com.codewithpcodes.smart.incident;

import com.codewithpcodes.smart.file.FileService;
import com.codewithpcodes.smart.road.RoadSegmentRepository;
import com.codewithpcodes.smart.seed.NominatimService;
import com.codewithpcodes.smart.user.User;
import com.codewithpcodes.smart.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final RoadSegmentRepository roadSegmentRepository;
    private final UserRepository userRepository;
    private final GeometryFactory geometryFactory;
    private final NominatimService nominatimService;
    private final FileService fileService;

    @Transactional
    public IncidentResponse reportIncident(
            CreateIncidentRequest request,
            List<MultipartFile> images,
            List<MultipartFile> videos,
            User currentUser
    ) {
        Incident incident = Incident.builder()
                .location(geometryFactory.createPoint(new Coordinate(request.lon(), request.lat())))
                .type(request.type())
                .severity(request.severity())
                .description(request.description())
                .status(IncidentStatus.OPEN)
                .reportedBy(currentUser)
                .reportedAt(LocalDateTime.now())
                .locationName(nominatimService.resolveRoadName(request.lat(), request.lon()))
                .segment(roadSegmentRepository.findNearestToPoint(request.lat(), request.lon())
                        .orElse(null))
                .build();
        Incident savedIncident = incidentRepository.save(incident);

        List<IncidentMedia> mediaList = new ArrayList<>();

        if (images != null && !images.isEmpty()) {
            List<String> imagePaths = fileService.saveIncidentImages(images, savedIncident.getId());
            List<IncidentMedia> imageMedia =
                    imagePaths.stream()
                            .map(path -> IncidentMedia.builder()
                                    .filePath(path)
                                    .mediaType(MediaType.IMAGE)
                                    .uploadedAt(Instant.now())
                                    .incident(savedIncident)
                                    .build()
                            )
                            .toList();
            mediaList.addAll(imageMedia);
        }

        if (videos != null && !videos.isEmpty()) {
            List<String> videoPaths = fileService.saveIncidentVideos(videos, savedIncident.getId());
            List<IncidentMedia> videoMedia =
                    videoPaths.stream()
                            .map(path -> IncidentMedia.builder()
                                    .filePath(path)
                                    .mediaType(MediaType.VIDEO)
                                    .uploadedAt(Instant.now())
                                    .incident(savedIncident)
                                    .build()
                            )
                            .toList();
            mediaList.addAll(videoMedia);
        }

        savedIncident.setMedia(mediaList);
        incidentRepository.save(savedIncident);
        return IncidentResponse.fromIncident(savedIncident);
    }

    public List<IncidentResponse> getAllActive() {
        return incidentRepository.findByStatusNotIn(List.of(IncidentStatus.CLOSED, IncidentStatus.RESOLVED))
                .stream()
                .map(IncidentResponse::fromIncident)
                .toList();
    }

    public List<IncidentResponse> getNearBy(double lat, double lon, double radiusMetres) {
        return incidentRepository.findActiveNearPoint(lat, lon, radiusMetres)
                .stream()
                .map(IncidentResponse::fromIncident)
                .toList();
    }

    public List<IncidentResponse> getMyReported(Integer userId) {
        return incidentRepository.findByReportedById(userId)
                .stream()
                .map(IncidentResponse::fromIncident)
                .toList();
    }

    public IncidentResponse getById(Long id) {
        return incidentRepository.findById(id)
                .map(IncidentResponse::fromIncident)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found with ID::" + id));
    }

    public IncidentResponse updateStatus(UpdateIncidentRequest request) {
        Incident incident = incidentRepository.findById(request.incidentId())
                .orElseThrow(() -> new IllegalArgumentException("Incident not found with ID::" + request.incidentId()));

        User officer = userRepository.findById(request.officerId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID::" + request.officerId()));

        validateTransition(incident.getStatus(), request.status());

        incident.setStatus(request.status());

        if (request.status() == IncidentStatus.ACKNOWLEDGED && incident.getAssignedTo() == null) {
            incident.setAssignedTo(officer);
        }

        if (request.status() == IncidentStatus.RESOLVED) {
            incident.setResolvedAt(LocalDateTime.now());
        }

        if (request.status() == IncidentStatus.CLOSED) {
            incident.setClosedAt(LocalDateTime.now());
            incident.setClosingNote(request.closingNote());
        }

        return IncidentResponse.fromIncident(incidentRepository.save(incident));
    }

    private void validateTransition(IncidentStatus currentStatus, IncidentStatus newStatus) {
        Map<IncidentStatus, List<IncidentStatus>> allowed = Map.of(
                IncidentStatus.OPEN, List.of(IncidentStatus.ACKNOWLEDGED),
                IncidentStatus.ACKNOWLEDGED, List.of(IncidentStatus.IN_RESPONSE),
                IncidentStatus.IN_RESPONSE, List.of(IncidentStatus.RESOLVED),
                IncidentStatus.RESOLVED, List.of(IncidentStatus.CLOSED)
        );

        if (!allowed.getOrDefault(currentStatus, List.of()).contains(newStatus)) {
            throw new IllegalArgumentException("Invalid transition from " + currentStatus + " to " + newStatus);
        }
    }

}
