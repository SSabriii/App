package com.archive_enseignant.archive.services;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public FileServiceImpl() {
        try {
            Files.createDirectories(fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory!");
        }
    }

    @Override
    public String save(MultipartFile file, Long id) {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path targetLocation = fileStorageLocation.resolve(fileName);
        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return targetLocation.toString();
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }

    @Override
    public Resource load(String filePath) {
        try {
            Path file = Paths.get(filePath).normalize();
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found");
            }
        } catch (IOException ex) {
            throw new RuntimeException("File not found", ex);
        }
    }

    @Override
    public void delete(String filePath) {
        try {
            Path file = Paths.get(filePath).normalize();
            Files.deleteIfExists(file);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file. Please try again!", ex);
        }
    }
}
