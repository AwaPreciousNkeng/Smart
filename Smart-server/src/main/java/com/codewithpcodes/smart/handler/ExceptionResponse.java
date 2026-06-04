package com.codewithpcodes.smart.handler;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExceptionResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private Map<String, String> errors;
    private LocalDateTime timestamp;

    public static <T> ExceptionResponse<T> errorMessage(String message) {
        return ExceptionResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ExceptionResponse<T> errorMap(
            String message, Map<String, String> errors) {
        return ExceptionResponse.<T>builder()
                .success(false)
                .message(message)
                .errors(errors)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ExceptionResponse<T> error(
            String message, String error
    ) {
        return ExceptionResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(LocalDateTime.now())
                .errors(Map.of("error", error))
                .build();
    }
}
