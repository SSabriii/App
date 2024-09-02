package com.archive_enseignant.archive.controllers;

import com.archive_enseignant.archive.entities.ProfilEnseignant;
import com.archive_enseignant.archive.services.FileService;
import com.archive_enseignant.archive.services.ProfilEnseignantService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/profilEnseignant")
@RequiredArgsConstructor
public class ProfilEnseignantController {

    private final ProfilEnseignantService profilEnseignantService;
    private final FileService fileService;

    @PostMapping
    public ProfilEnseignant create(@RequestBody ProfilEnseignant profilEnseignant) {
        return profilEnseignantService.save(profilEnseignant);
    }

    @GetMapping
    public List<ProfilEnseignant> getAll() {
        return profilEnseignantService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<ProfilEnseignant> getById(@PathVariable Long id) {
        return profilEnseignantService.findById(id);
    }

    @PutMapping("/{id}")
    public ProfilEnseignant update(@PathVariable Long id, @RequestBody ProfilEnseignant updatedProfilEnseignant) {
        Optional<ProfilEnseignant> existingProfilEnseignant = profilEnseignantService.findById(id);

        if (existingProfilEnseignant.isPresent()) {
            ProfilEnseignant profilEnseignant = existingProfilEnseignant.get();
            profilEnseignant.setNom(updatedProfilEnseignant.getNom());
            profilEnseignant.setPrenom(updatedProfilEnseignant.getPrenom());
            profilEnseignant.setDepartment(updatedProfilEnseignant.getDepartment());
            profilEnseignant.setExperience(updatedProfilEnseignant.getExperience());
            profilEnseignant.setGrade(updatedProfilEnseignant.getGrade());
            profilEnseignant.setCvFilePath(updatedProfilEnseignant.getCvFilePath());
            profilEnseignant.setCarteIdentiteFilePath(updatedProfilEnseignant.getCarteIdentiteFilePath());
            profilEnseignant.setAutorisationFilePath(updatedProfilEnseignant.getAutorisationFilePath());
            profilEnseignant.setPhotoFilePath(updatedProfilEnseignant.getPhotoFilePath());

            return profilEnseignantService.save(profilEnseignant);
        } else {
            throw new RuntimeException("ProfilEnseignant with id " + id + " not found");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        profilEnseignantService.deleteById(id);
    }

    @PostMapping("/createWithAllDocuments")
    public ResponseEntity<ProfilEnseignant> createWithAllDocuments(
            @RequestParam("nom") String nom,
            @RequestParam("prenom") String prenom,
            @RequestParam("department") String department,
            @RequestParam("experience") String experience,
            @RequestParam("grade") String grade,
            @RequestParam("cvFile") MultipartFile cvFile,
            @RequestParam("carteIdentiteFile") MultipartFile carteIdentiteFile,
            @RequestParam("autorisationFile") MultipartFile autorisationFile,
            @RequestParam(value = "photoFile", required = false) MultipartFile photoFile) {


        ProfilEnseignant profilEnseignant = new ProfilEnseignant();
        profilEnseignant.setNom(nom);
        profilEnseignant.setPrenom(prenom);
        profilEnseignant.setDepartment(department);
        profilEnseignant.setExperience(experience);
        profilEnseignant.setGrade(grade);


        ProfilEnseignant savedProfilEnseignant = profilEnseignantService.save(profilEnseignant);


        String cvFilePath = fileService.save(cvFile, savedProfilEnseignant.getId());
        String carteIdentiteFilePath = fileService.save(carteIdentiteFile, savedProfilEnseignant.getId());
        String autorisationFilePath = fileService.save(autorisationFile, savedProfilEnseignant.getId());
        String photoFilePath = (photoFile != null) ? fileService.save(photoFile, savedProfilEnseignant.getId()) : null;


        savedProfilEnseignant.setCvFilePath(cvFilePath);
        savedProfilEnseignant.setCarteIdentiteFilePath(carteIdentiteFilePath);
        savedProfilEnseignant.setAutorisationFilePath(autorisationFilePath);
        savedProfilEnseignant.setPhotoFilePath(photoFilePath);


        ProfilEnseignant updatedProfilEnseignant = profilEnseignantService.save(savedProfilEnseignant);

        return ResponseEntity.ok(updatedProfilEnseignant);
    }

    @PostMapping("/{id}/uploadCV")
    public ResponseEntity<String> uploadCV(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String filePath = fileService.save(file, id);
        ProfilEnseignant profilEnseignant = profilEnseignantService.findById(id)
                .orElseThrow(() -> new RuntimeException("ProfilEnseignant with id " + id + " not found"));

        profilEnseignant.setCvFilePath(filePath);
        profilEnseignantService.save(profilEnseignant);

        return ResponseEntity.ok("CV uploaded successfully!");
    }

    @GetMapping("/{id}/downloadCV")
    public ResponseEntity<Resource> downloadCV(@PathVariable Long id) {
        ProfilEnseignant profilEnseignant = profilEnseignantService.findById(id)
                .orElseThrow(() -> new RuntimeException("ProfilEnseignant with id " + id + " not found"));

        String cvFilePath = profilEnseignant.getCvFilePath();
        Resource file = fileService.load(cvFilePath);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + cvFilePath.substring(cvFilePath.lastIndexOf("/") + 1) + "\"")
                .body(file);
    }

    @PostMapping("/{id}/uploadCarteIdentite")
    public ResponseEntity<String> uploadCarteIdentite(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String filePath = fileService.save(file, id);
        ProfilEnseignant profilEnseignant = profilEnseignantService.findById(id)
                .orElseThrow(() -> new RuntimeException("ProfilEnseignant with id " + id + " not found"));

        profilEnseignant.setCarteIdentiteFilePath(filePath);
        profilEnseignantService.save(profilEnseignant);

        return ResponseEntity.ok("Carte d'identité uploaded successfully!");
    }

    @PostMapping("/{id}/uploadAutorisation")
    public ResponseEntity<String> uploadAutorisation(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String filePath = fileService.save(file, id);
        ProfilEnseignant profilEnseignant = profilEnseignantService.findById(id)
                .orElseThrow(() -> new RuntimeException("ProfilEnseignant with id " + id + " not found"));

        profilEnseignant.setAutorisationFilePath(filePath);
        profilEnseignantService.save(profilEnseignant);

        return ResponseEntity.ok("Autorisation d'enseigner uploaded successfully!");
    }

    @GetMapping("/{id}/downloadCarteIdentite")
    public ResponseEntity<Resource> downloadCarteIdentite(@PathVariable Long id) {
        ProfilEnseignant profilEnseignant = profilEnseignantService.findById(id)
                .orElseThrow(() -> new RuntimeException("ProfilEnseignant with id " + id + " not found"));

        String filePath = profilEnseignant.getCarteIdentiteFilePath();
        Resource file = fileService.load(filePath);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.substring(filePath.lastIndexOf("/") + 1) + "\"")
                .body(file);
    }

    @GetMapping("/{id}/downloadAutorisation")
    public ResponseEntity<Resource> downloadAutorisation(@PathVariable Long id) {
        ProfilEnseignant profilEnseignant = profilEnseignantService.findById(id)
                .orElseThrow(() -> new RuntimeException("ProfilEnseignant with id " + id + " not found"));

        String filePath = profilEnseignant.getAutorisationFilePath();
        Resource file = fileService.load(filePath);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.substring(filePath.lastIndexOf("/") + 1) + "\"")
                .body(file);
    }

    @PostMapping("/{id}/uploadPhoto")
    public ResponseEntity<String> uploadPhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String filePath = fileService.save(file, id);
        ProfilEnseignant profilEnseignant = profilEnseignantService.findById(id)
                .orElseThrow(() -> new RuntimeException("ProfilEnseignant with id " + id + " not found"));

        profilEnseignant.setPhotoFilePath(filePath);
        profilEnseignantService.save(profilEnseignant);

        return ResponseEntity.ok("Photo uploaded successfully!");
    }

    @GetMapping("/{id}/downloadPhoto")
    public ResponseEntity<Resource> downloadPhoto(@PathVariable Long id) {
        ProfilEnseignant profilEnseignant = profilEnseignantService.findById(id)
                .orElseThrow(() -> new RuntimeException("ProfilEnseignant with id " + id + " not found"));

        String filePath = profilEnseignant.getPhotoFilePath();
        Resource file = fileService.load(filePath);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.substring(filePath.lastIndexOf("/") + 1) + "\"")
                .body(file);
    }

    @DeleteMapping("/{id}/deletePhoto")
    public ResponseEntity<String> deletePhoto(@PathVariable Long id) {
        ProfilEnseignant profilEnseignant = profilEnseignantService.findById(id)
                .orElseThrow(() -> new RuntimeException("ProfilEnseignant with id " + id + " not found"));

        String photoFilePath = profilEnseignant.getPhotoFilePath();
        if (photoFilePath != null) {
            fileService.delete(photoFilePath);
            profilEnseignant.setPhotoFilePath(null);
            profilEnseignantService.save(profilEnseignant);
            return ResponseEntity.ok("Photo deleted successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No photo found to delete.");
        }
    }
}
