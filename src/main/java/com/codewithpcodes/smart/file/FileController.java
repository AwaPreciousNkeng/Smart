package com.codewithpcodes.smart.file;

import com.google.common.net.HttpHeaders;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Tag(name = "File Management", description = "File Management Endpoints")
public class FileController {

    private final FileService fileService;

    @PostMapping(
            value = "/incidents/{incidentId}/images",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<List<String>> uploadIncidentImages(
            @PathVariable long incidentId,
            @RequestParam("files") List<MultipartFile> files
    ) {
        List<String> uploadedFiles = fileService.saveIncidentImages(files, incidentId);
        return ResponseEntity.ok(uploadedFiles);
    }

    @PostMapping(
            value = "/incidents/{incidentId}/videos",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<List<String>> uploadIncidentVideos(
            @PathVariable long incidentId,
            @RequestParam("files") List<MultipartFile> files
    ) {
        List<String> uploadedFiles = fileService.saveIncidentVideos(files, incidentId);
        return ResponseEntity.ok(uploadedFiles);
    }

    @PostMapping(
            value = "/incidents/{incidentId}/media",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<List<String>> uploadIncidentMedia(
            @PathVariable long incidentId,
            @RequestParam(
                    value = "images",
                    required = false
            )
            List<MultipartFile> images,
            @RequestParam(
                    value = "videos",
                    required = false
            )
            List<MultipartFile> videos
    ) {
        List<String> uploadedFiles = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            uploadedFiles.addAll(fileService.saveIncidentImages(images, incidentId));
        }

        if (videos != null && !videos.isEmpty()) {
            uploadedFiles.addAll(fileService.saveIncidentVideos(videos, incidentId));
        }

        return ResponseEntity.ok(uploadedFiles);
    }

    @GetMapping
    public ResponseEntity<byte[]> getFile(
            @RequestParam String path
    ) {
        byte[] file = fileService.getFile(path);
        if (file.length == 0) {
            return ResponseEntity
                    .notFound()
                    .build();
        }
        MediaType mediaType = fileService.getFileMediaType(path);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_TYPE,
                        mediaType.toString()
                )
                .body(file);
    }
}
