package com.codewithpcodes.smart.user;

import java.time.LocalDateTime;

public record UserResponse(
        Integer id,
        String firstName,
        String lastName,
        String fullName,
        String email,
        String profilePicturePath,
        Role role,
        LocalDateTime createdAt
) {
    public static UserResponse fromUser(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getFullName(),
                user.getEmail(),
                user.getProfilePicturePath(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}