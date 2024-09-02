package com.archive_enseignant.archive.controllers;

import com.archive_enseignant.archive.entities.DirectionRh;
import com.archive_enseignant.archive.services.DirectionRhService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/directionRh")
@RequiredArgsConstructor
public class DirectionRhController {

    private final DirectionRhService directionRhService;

    @PostMapping
    public DirectionRh create(@RequestBody DirectionRh directionRh){
        return directionRhService.save(directionRh);
    }

    @GetMapping
    public List<DirectionRh> getAll() {
        return directionRhService.getAll();
    }

    @GetMapping("/{id}")
    public Optional<DirectionRh> getById(@PathVariable Long id) {
        return directionRhService.getById(id);
    }

    @PutMapping("/{id}")
    public DirectionRh update(@PathVariable Long id, @RequestBody DirectionRh updatedDirectionRh) {
        Optional<DirectionRh> existingDirectionRh = directionRhService.getById(id);

        if(existingDirectionRh.isPresent()) {
            DirectionRh directionRh = existingDirectionRh.get();
            directionRh.setNom(updatedDirectionRh.getNom());
            directionRh.setPrenom(updatedDirectionRh.getPrenom());


            return directionRhService.save(directionRh);
        } else {
            throw new RuntimeException("DirectionRh with id " + id + " not found");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        directionRhService.deleteById(id);
    }
}
