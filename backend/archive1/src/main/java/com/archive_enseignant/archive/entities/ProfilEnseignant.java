package com.archive_enseignant.archive.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class ProfilEnseignant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String prenom;
    private String department;
    private String experience;
    private String grade;
    private String cvFilePath;
    private String carteIdentiteFilePath;
    private String autorisationFilePath;
    private String photoFilePath;
}
