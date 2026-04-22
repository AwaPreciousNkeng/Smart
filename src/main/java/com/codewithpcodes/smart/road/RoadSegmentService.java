package com.codewithpcodes.smart.road;

import com.codewithpcodes.smart.seed.NominatimService;
import com.codewithpcodes.smart.user.User;
import com.codewithpcodes.smart.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class RoadSegmentService {

    private final RoadSegmentRepository roadSegmentRepository;
    private final UserRepository userRepository;
    private final NominatimService nominatimService;
    private final RoadTrafficRepository roadTrafficRepository;


    public RoadSegmentResponse updateTrafficLevel(
            Long trafficID,
            TrafficLevel trafficLevel,
            User officer
    ) {
        RoadTraffic traffic = roadTrafficRepository.findById(trafficID)
                .orElseThrow(() -> new IllegalArgumentException("Traffic info not found"));
        RoadSegment segment = traffic.getSegment();
        traffic.setLevel(trafficLevel);
        traffic.setTrafficLevelUpdatedAt(Instant.now());
        roadTrafficRepository.save(traffic);
        return fromRoad(segment);
    }
    public String getRoadNameFromLineString(Integer roadID) {
        Map<String, Double> midPoint = roadSegmentRepository.findMidPoint(roadID);
        return nominatimService.resolveRoadName(midPoint.get("lat"), midPoint.get("lon"));
    }

    private String getTraffic(Integer roadID) {
         RoadTraffic traffic =  roadTrafficRepository.findBySegmentId(roadID)
                 .orElse(null);
         return traffic != null ? traffic.getLevel().toString() : "Unknown";
    }

    private RoadSegmentResponse fromRoad(RoadSegment segment) {
        return new RoadSegmentResponse(
                segment.getId(),
                segment.getName() != null
                ? segment.getName()
                        : getRoadNameFromLineString(segment.getId()),
                getTraffic(segment.getId()),
                segment.getGeom()
        );
    }
}

