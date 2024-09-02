package com.archive_enseignant.archive.services;

import com.archive_enseignant.archive.entities.ProfilEnseignant;
import com.archive_enseignant.archive.repositories.ProfilEnseignantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfilEnseignantService {

    private final ProfilEnseignantRepository profilEnseignantRepository;


    public ProfilEnseignantService(ProfilEnseignantRepository profilEnseignantRepository) {
        this.profilEnseignantRepository = profilEnseignantRepository;
    }

    public ProfilEnseignant save(ProfilEnseignant profilEnseignant) {
        return profilEnseignantRepository.save(profilEnseignant);
    }

    public List<ProfilEnseignant> findAll() {
        return profilEnseignantRepository.findAll();
    }

    public Optional<ProfilEnseignant> findById(Long id) {
        return profilEnseignantRepository.findById(id);
    }

    public void deleteById(Long id) {
        profilEnseignantRepository.deleteById(id);
    }
}
