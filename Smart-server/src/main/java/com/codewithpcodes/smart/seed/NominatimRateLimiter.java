package com.codewithpcodes.smart.seed;

import com.google.common.util.concurrent.RateLimiter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NominatimRateLimiter {

    @Bean
    public RateLimiter nominatimLimiter() {
        return RateLimiter.create(1.0);
    }
}
