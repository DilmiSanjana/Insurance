package com.example.secrud.services;

import com.example.secrud.dto.UnderWriterDocumentRequestDTO;
import com.example.secrud.dto.UnderWriterDocumentResponseDTO;

import java.util.List;
import java.util.Optional;

public interface UnderWriterDocumentService {
    UnderWriterDocumentResponseDTO create(UnderWriterDocumentRequestDTO request);
    List<UnderWriterDocumentResponseDTO> getAll();
    Optional<UnderWriterDocumentResponseDTO> getById(Long id);
    Optional<UnderWriterDocumentResponseDTO> update(Long id, UnderWriterDocumentRequestDTO request);
    boolean delete(Long id);
}