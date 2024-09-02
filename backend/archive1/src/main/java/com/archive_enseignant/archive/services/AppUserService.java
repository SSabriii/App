package com.archive_enseignant.archive.services;

import com.archive_enseignant.archive.entities.AppUser;
import com.archive_enseignant.archive.repositories.AppUserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;


    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public AppUser save(AppUser appUser) {
        return appUserRepository.save(appUser);
    }

    public List<AppUser> getAll() {
        return appUserRepository.findAll();
    }

    public Optional<AppUser> getById(Long id) {
        return appUserRepository.findById(id);
    }

    public void deleteById(Long id) {
        appUserRepository.deleteById(id);
    }
}
