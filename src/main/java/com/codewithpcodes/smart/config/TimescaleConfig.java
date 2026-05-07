package com.codewithpcodes.smart.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

@Configuration
@DependsOn("entityManagerFactory")
@RequiredArgsConstructor
public class TimescaleConfig {

    private final DataSource dataSource;

    @PostConstruct
    public void initDatabase() throws SQLException {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute("CREATE EXTENSION IF NOT EXISTS postgis;");
            stmt.execute("CREATE EXTENSION IF NOT EXISTS timescaledb;");

            stmt.execute("""
SELECT create_hypertable(
       'location_ping',
       'time',
       chunk_time_interval := INTERVAL '1 day',
       if_not_exists := TRUE
);
""");
        }
    }
}
