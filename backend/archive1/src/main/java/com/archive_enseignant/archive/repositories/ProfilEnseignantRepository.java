package com.archive_enseignant.archive.repositories;

import com.archive_enseignant.archive.entities.ProfilEnseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfilEnseignantRepository extends JpaRepository<ProfilEnseignant,Long> {
}
