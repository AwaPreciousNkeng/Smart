package com.codewithpcodes.smart.handler;

import com.codewithpcodes.smart.exception.*;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.LinkedHashMap;
import java.util.Map;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ExceptionResponse<Void>> handleResourceNotFoundException(ResourceNotFoundException ex){
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ExceptionResponse.errorMessage(ex.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ExceptionResponse<Void>> handleUnauthorizedException(UnauthorizedException ex){
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ExceptionResponse.errorMessage(ex.getMessage()));
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ExceptionResponse<Void>> handleForbiddenException(ForbiddenException ex){
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ExceptionResponse.errorMessage(ex.getMessage()));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ExceptionResponse<Void>> handleDuplicateResourceException(DuplicateResourceException ex){
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ExceptionResponse.errorMessage(ex.getMessage()));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ExceptionResponse<Void>> handleBadRequestException(BadRequestException ex){
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ExceptionResponse.errorMessage(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse<Void>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex){
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult()
                .getFieldErrors()
                .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ExceptionResponse.errorMap("Validation failed", errors));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ExceptionResponse<Void>> handleConstraintViolationException(ConstraintViolationException ex){
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getConstraintViolations()
                .forEach(v -> errors.put(v.getPropertyPath().toString(), v.getMessage()));
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ExceptionResponse.errorMap("Constraint violation", errors));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ExceptionResponse<Void>> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex){
        String message = String.format(
                "Invalid value '%s' for parameter '%s'",
                ex.getValue(),
                ex.getName()
        );
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ExceptionResponse.errorMessage(message));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ExceptionResponse<Void>> handleMaxUploadSizeException(MaxUploadSizeExceededException ex){
        return ResponseEntity
                .status(HttpStatus.CONTENT_TOO_LARGE)
                .body(ExceptionResponse.errorMessage("File size exceeds the maximum limit"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse<Void>> handleException(Exception ex){
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ExceptionResponse.error("An unexpected error occurred", ex.getMessage()));
    }
}
