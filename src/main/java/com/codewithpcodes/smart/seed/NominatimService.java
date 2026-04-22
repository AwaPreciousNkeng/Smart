package com.codewithpcodes.smart.seed;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.util.concurrent.RateLimiter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class NominatimService {

    private RestTemplate restTemplate;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final RateLimiter nominatimLimiter;

    private static final String CACHE_PREFIX = "geo:name:";
    private static final Duration CACHE_TTL = Duration.ofDays(30);

    public String resolveRoadName(double lat, double lon) {
        String cacheKey = CACHE_PREFIX + lat + ":" + lon;

        //1. Check Redis cache first
        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) return cached;

        //2. call Nominatim
        String url = "https://nominatim.openstreetmap.org/reverse"
                + "?lat=" + lat
                +"&lon="+ lon
                +"&format=json"
                +"&zoom=17";

        try {
            nominatimLimiter.acquire();
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Smart/1.0 (PCodes)");
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode address = root.path("address");

            String name = firstNonEmpty(
                    root.path("name").asText(null),
                    address.path("road").asText(null),
                    address.path("pedestian").asText(null),
                    address.path("neighbourhood").asText(null),
                    address.path("suburb").asText(null)
            );

            if (name == null) name = "Unnamed Road";

            //3. Cache the result
            redisTemplate.opsForValue().set(cacheKey, name, CACHE_TTL);
            return name;

        } catch (Exception e) {
            return "Unnamed Road";
        }
    }

    private String firstNonEmpty(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) return value;
        }
        return null;
    }
}
