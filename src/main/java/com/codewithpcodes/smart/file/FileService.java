package com.codewithpcodes.smart.file;

import jakarta.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileService {

    @Value("${application.file.uploads.media-output-path}")
    private String fileUploadPath;

    private static final int MAX_FILE_SIZE = 1024 * 1024 * 5;

    public String saveFile(
            @Nonnull MultipartFile sourceFile,
            @Nonnull Integer userId
    ) {

        validateFile(sourceFile);

        //store under users/{userId}/
        final String subPath = "users" + File.separator + userId;
        return uploadFile(sourceFile, subPath);
    }

    private String uploadFile(
            @Nonnull MultipartFile sourceFile,
            @Nonnull String fileUploadSubPath
    ) {
        final String finalUploadPath = fileUploadPath + File.separator + fileUploadSubPath;
        File targetFolder = new File(finalUploadPath);
        if (!targetFolder.exists()) {
            boolean folderCreated = targetFolder.mkdirs();
            if (!folderCreated) {
                log.warn("Failed to create the target folder, {}", targetFolder);
                throw new RuntimeException("Failed to create the upload directory");
            }
        }
        String fileExtension = getFileExtension(sourceFile.getOriginalFilename());
        String targetFilePath = fileUploadPath + File.separator + System.currentTimeMillis() + fileExtension;
        Path targetPath = Paths.get(targetFilePath);
        try {
            Files.write(targetPath, sourceFile.getBytes());
            log.info("File saved to {}", targetPath);
            return targetFilePath;
        } catch (IOException e) {
            log.error("File was not saved: {}", e.getMessage());
            throw new RuntimeException("Failed to save File", e);
        }
    }

    private void validateFile(MultipartFile sourceFile) {
        if (sourceFile.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (sourceFile.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size is too large. Max file size is 5MB");
        }

        String extension = getFileExtension(sourceFile.getOriginalFilename()).replace(".", "");

    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            return "";
        }

        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return "";
        }

        return "." + fileName.substring(lastDotIndex + 1).toLowerCase();
    }
}
