package com.amigossnacks.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UploadController {

    private static final String UPLOAD_DIR = "uploads";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Please select a file to upload");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // Create uploads directory if it doesn't exist
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Generate a unique file name
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + extension;

            // Save the file
            Path path = Paths.get(UPLOAD_DIR, fileName);
            Files.write(path, file.getBytes());

            // Build response URL
            String fileUrl = "/uploads/" + fileName;

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", fileUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to store file: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
