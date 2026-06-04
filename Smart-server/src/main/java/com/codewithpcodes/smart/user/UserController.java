package com.codewithpcodes.smart.user;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "User Management Endpoints")
public class UserController {
    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Integer id
    ) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PatchMapping
    public ResponseEntity<UserResponse> updateUser (
            @AuthenticationPrincipal User currentUser,
            @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(userService.updateUser(currentUser, request));
    }

    @PostMapping(
            value = "/{id}/profile-picture",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UserResponse> uploadProfilePicture(
            @AuthenticationPrincipal User currentUser,
            @RequestPart(value = "file", required = false) List<MultipartFile> files
    ) {
        return ResponseEntity.ok(userService.uploadProfilePicture(currentUser, files));
    }
}
