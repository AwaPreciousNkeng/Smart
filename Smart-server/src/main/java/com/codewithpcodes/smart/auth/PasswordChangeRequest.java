package com.codewithpcodes.smart.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordChangeRequest(
        @NotBlank(message = "Current Password is required")
        String currentPassword,
        @NotBlank(message = "New Password is required")
        @Size(min = 6, message = "Password should be at least 6 characters long")
        String newPassword,
        @NotBlank(message = "Confirm New Password is required")
        String confirmNewPassword
) {
}
