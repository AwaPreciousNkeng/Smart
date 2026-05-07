package com.codewithpcodes.smart.user;

public record UserResponse(
        Integer id,
        String firstName,
        String lastName,
        String email,
        String profilePicturePath,
        Role role
) {
    public static UserResponse fromUser(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getProfilePicturePath(),
                user.getRole()
        );
    }
}
