package com.codewithpcodes.smart;

import com.codewithpcodes.smart.auth.AuthenticationService;
import com.codewithpcodes.smart.auth.CreateAdminRequest;
import com.codewithpcodes.smart.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SmartApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartApplication.class, args);
    }

    @Bean
    CommandLineRunner initAdmin(
            AuthenticationService service,
            UserRepository userRepository
    ) {
        return args -> {
            String defaultEmail = "admin@smart.com";

            if (!userRepository.existsByEmail(defaultEmail)) {
                var admin = new CreateAdminRequest(
                        "admin",
                        "pcodes",
                        "admin@smart.com",
                        "password"
                );
                System.out.println("Admin token: " + service.createAdmin(admin).getAccessToken());
            } else {
                System.out.println("Default Admin already exists. Skipping creation...");
            }
        };
    }
}
