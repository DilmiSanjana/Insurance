package com.example.secrud.repositories;

import com.example.secrud.models.UnderWriterDocumentModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnderWriterDocumentRepository extends JpaRepository<UnderWriterDocumentModel, Long> {
}