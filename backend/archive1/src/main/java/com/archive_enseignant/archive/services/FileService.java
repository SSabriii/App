package com.archive_enseignant.archive.services;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    String save(MultipartFile file, Long id);
    Resource load(String filePath);
    void delete(String filePath);
}
