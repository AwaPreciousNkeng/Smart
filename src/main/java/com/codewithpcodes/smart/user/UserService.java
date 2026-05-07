package com.codewithpcodes.smart.user;

import com.codewithpcodes.smart.file.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FileService fileService;

    public UserResponse getUser (Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));

        return UserResponse.fromUser(user);
    }

    public UserResponse uploadProfilePicture(
            User currentUser,
            List<MultipartFile> files
    ) {
        if (files != null && !files.isEmpty()) {
            String path = fileService.saveProfilePicture(files.getFirst(), currentUser.getId());
            currentUser.setProfilePicturePath(path);
        }
        return UserResponse.fromUser(userRepository.save(currentUser));
    }

    public UserResponse updateUser(User currentUser, UpdateUserRequest request) {
        if (request.firstName() != null) {
            currentUser.setFirstName(request.firstName());
        }

        if (request.lastName() != null) {
            currentUser.setLastName(request.lastName());
        }

        if (request.gender() != null) {
            currentUser.setGender(request.gender());
        }

        if (request.language() != null) {
            currentUser.setLanguage(request.language());
        }

        return UserResponse.fromUser(userRepository.save(currentUser));
    }
}
