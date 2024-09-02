package com.archive_enseignant.archive.repositories;

import com.archive_enseignant.archive.entities.DirectionRh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DirectionRhRepository extends JpaRepository<DirectionRh, Long> {
}
