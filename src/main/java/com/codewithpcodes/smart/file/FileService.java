package com.codewithpcodes.smart.file;

import jakarta.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileService {

    @Value("${application.file.uploads.media-output-path}")
    private String fileUploadPath;

    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    private static final long MAX_VIDEO_SIZE = 100 * 1024 * 1024;

    private static final Set<String> IMAGE_EXTENSIONS = Set.of(
            "jpg",
            "jpeg",
            "png",
            "webp"
    );

    private static final Set<String> VIDEO_EXTENSIONS = Set.of(
            "mp4",
            "mov",
            "avi",
            "mkv"
    );

    public List<String> saveProfilePictures(
            @Nonnull List<MultipartFile> files,
            @Nonnull Integer userId
    ) {

        validateFiles(files);

        return files.stream()
                .map(file -> saveProfilePicture(file, userId))
                .toList();
    }

    public List<String> saveIncidentImages(
            @Nonnull List<MultipartFile> files,
            @Nonnull Long incidentId
    ) {

        validateFiles(files);

        return files.stream()
                .map(file -> saveIncidentImage(file, incidentId))
                .toList();
    }

    public List<String> saveIncidentVideos(
            @Nonnull List<MultipartFile> files,
            @Nonnull Long incidentId
    ) {

        validateFiles(files);

        return files.stream()
                .map(file -> saveIncidentVideo(file, incidentId))
                .toList();
    }

    public String saveProfilePicture(
            @Nonnull MultipartFile file,
            @Nonnull Integer userId
    ) {

        validateImage(file);

        String subPath =
                "users"
                        + File.separator
                        + userId
                        + File.separator
                        + "profile-pictures";

        return uploadFile(file, subPath);
    }

    public String saveIncidentImage(
            @Nonnull MultipartFile file,
            @Nonnull Long incidentId
    ) {

        validateImage(file);

        String subPath =
                "incidents"
                        + File.separator
                        + incidentId
                        + File.separator
                        + "images";

        return uploadFile(file, subPath);
    }

    public String saveIncidentVideo(
            @Nonnull MultipartFile file,
            @Nonnull Long incidentId
    ) {

        validateVideo(file);

        String subPath =
                "incidents"
                        + File.separator
                        + incidentId
                        + File.separator
                        + "videos";

        return uploadFile(file, subPath);
    }

    private String uploadFile(
            @Nonnull MultipartFile sourceFile,
            @Nonnull String uploadSubPath
    ) {

        String finalUploadPath =
                fileUploadPath
                        + File.separator
                        + uploadSubPath;

        File targetFolder = new File(finalUploadPath);

        if (!targetFolder.exists()) {

            boolean folderCreated = targetFolder.mkdirs();

            if (!folderCreated) {

                log.error(
                        "Failed to create upload directory {}",
                        finalUploadPath
                );

                throw new RuntimeException(
                        "Failed to create upload directory"
                );
            }
        }

        String extension =
                getFileExtension(
                        sourceFile.getOriginalFilename()
                );

        String fileName =
                UUID.randomUUID() + extension;

        String targetFilePath =
                finalUploadPath
                        + File.separator
                        + fileName;

        Path targetPath = Paths.get(targetFilePath);

        try {

            Files.write(
                    targetPath,
                    sourceFile.getBytes()
            );

            log.info(
                    "File uploaded successfully to {}",
                    targetPath
            );

            return targetFilePath;

        } catch (IOException e) {

            log.error(
                    "Failed to save file: {}",
                    e.getMessage()
            );

            throw new RuntimeException(
                    "Failed to save file",
                    e
            );
        }
    }

    private void validateFiles(
            List<MultipartFile> files
    ) {

        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException(
                    "No files provided"
            );
        }
    }

    private void validateImage(
            MultipartFile file
    ) {

        validateNotEmpty(file);

        if (file.getSize() > MAX_IMAGE_SIZE) {

            throw new IllegalArgumentException(
                    "Image exceeds maximum size of 5MB"
            );
        }

        String extension =
                getFileExtension(
                        file.getOriginalFilename()
                ).replace(".", "");

        if (!IMAGE_EXTENSIONS.contains(extension)) {

            throw new IllegalArgumentException(
                    "Unsupported image format"
            );
        }
    }

    private void validateVideo(
            MultipartFile file
    ) {

        validateNotEmpty(file);

        if (file.getSize() > MAX_VIDEO_SIZE) {

            throw new IllegalArgumentException(
                    "Video exceeds maximum size of 100MB"
            );
        }

        String extension =
                getFileExtension(
                        file.getOriginalFilename()
                ).replace(".", "");

        if (!VIDEO_EXTENSIONS.contains(extension)) {

            throw new IllegalArgumentException(
                    "Unsupported video format"
            );
        }
    }

    private void validateNotEmpty(
            MultipartFile file
    ) {

        if (file.isEmpty()) {

            throw new IllegalArgumentException(
                    "File is empty"
            );
        }
    }

    private String getFileExtension(
            String fileName
    ) {

        if (fileName == null || fileName.isEmpty()) {
            return "";
        }

        int lastDotIndex =
                fileName.lastIndexOf(".");

        if (lastDotIndex == -1) {
            return "";
        }

        return fileName
                .substring(lastDotIndex)
                .toLowerCase();
    }

    public byte[] getFile(@Nonnull String relativePath) {
        String fullPath = fileUploadPath + File.separator + relativePath;
        return FileUtils.readFileFromLocation(fullPath);
    }

    public MediaType getFileMediaType(@Nonnull String filePath) {
        String extension = getFileExtension(filePath).replace(".", "");
        if (IMAGE_EXTENSIONS.contains(extension)) {
            return switch (extension) {
                case "png" -> MediaType.IMAGE_PNG;
                case "webp" -> MediaType.valueOf("image/webp");
                default -> MediaType.IMAGE_JPEG;
            };
        }
        if (VIDEO_EXTENSIONS.contains(extension)) {
            return switch (extension) {
                case "mp4" -> MediaType.valueOf("video/mp4");
                case "mov" -> MediaType.valueOf("video/quicktime");
                case "avi" -> MediaType.valueOf("video/x-msvideo");
                case "mkv" -> MediaType.valueOf("video/x-matroska");
                default -> MediaType.APPLICATION_OCTET_STREAM;
            };
        }

        return MediaType.APPLICATION_OCTET_STREAM;
    }

}