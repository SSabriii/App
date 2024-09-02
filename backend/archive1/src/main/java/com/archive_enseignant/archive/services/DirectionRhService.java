package com.archive_enseignant.archive.services;

import com.archive_enseignant.archive.entities.DirectionRh;
import com.archive_enseignant.archive.repositories.DirectionRhRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DirectionRhService {

    private final DirectionRhRepository directionRhRepository;


    public DirectionRhService(DirectionRhRepository directionRhRepository) {
        this.directionRhRepository = directionRhRepository;
    }

    public DirectionRh save(DirectionRh directionRh) {
        return directionRhRepository.save(directionRh);
    }

    public List<DirectionRh> getAll() {
        return directionRhRepository.findAll();
    }

    public Optional<DirectionRh> getById(Long id) {
        return directionRhRepository.findById(id);
    }

    public void deleteById(Long id) {
        directionRhRepository.deleteById(id);
    }
}
