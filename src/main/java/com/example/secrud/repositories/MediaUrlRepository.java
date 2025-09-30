package com.example.secrud.repositories;

import com.example.secrud.models.MediaUrlModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaUrlRepository extends JpaRepository<MediaUrlModel, Long> {
}