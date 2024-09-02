package com.archive_enseignant.archive.controllers;

import com.archive_enseignant.archive.entities.AppUser;
import com.archive_enseignant.archive.services.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/appUser")
@RequiredArgsConstructor
public class AppUserController {

    private final AppUserService appUserService;

    @PostMapping
    public AppUser create(@RequestBody AppUser appUser) {
        return appUserService.save(appUser);
    }

    @GetMapping
    public List<AppUser> getAll() {
        return appUserService.getAll();
    }

    @GetMapping("/{id}")
    public Optional<AppUser> getById(@PathVariable Long id) {
        return appUserService.getById(id);
    }

    @PutMapping("/{id}")
    public AppUser update(@PathVariable Long id, @RequestBody AppUser updatedAppUser) {
        Optional<AppUser> existingAppUser = appUserService.getById(id);

        if (existingAppUser.isPresent()) {
            AppUser appUser = existingAppUser.get();
            appUser.setUsername(updatedAppUser.getUsername());
            appUser.setPassword(updatedAppUser.getPassword());
            appUser.setEmail(updatedAppUser.getEmail());
            appUser.setRole(updatedAppUser.getRole());

            return appUserService.save(appUser);
        } else {
            throw new RuntimeException("AppUser with id " + id + " not found");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        appUserService.deleteById(id);
    }
}
