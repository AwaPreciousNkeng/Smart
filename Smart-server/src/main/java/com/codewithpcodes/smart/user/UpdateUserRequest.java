package com.codewithpcodes.smart.user;

public record UpdateUserRequest(
        String firstName,
        String lastName,
        Language language,
        Gender gender
) {
}
