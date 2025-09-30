package com.example.secrud.services.impl;

import com.example.secrud.dto.UnderWriterDocumentRequestDTO;
import com.example.secrud.dto.UnderWriterDocumentResponseDTO;
import com.example.secrud.models.MediaUrlModel;
import com.example.secrud.models.UnderWriterDocumentModel;
import com.example.secrud.repositories.UnderWriterDocumentRepository;
import com.example.secrud.services.UnderWriterDocumentService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UnderWriterDocumentServiceImpl implements UnderWriterDocumentService {

    private final UnderWriterDocumentRepository documentRepository;

    public UnderWriterDocumentServiceImpl(UnderWriterDocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @Override
    public UnderWriterDocumentResponseDTO create(UnderWriterDocumentRequestDTO request) {
        try {
            UnderWriterDocumentModel doc = new UnderWriterDocumentModel();
            doc.setCustomerEmail(request.getCustomerEmail());
            // status default PENDING if not provided
            if (request.getStatus() != null && !request.getStatus().isBlank()) {
                doc.setStatus(UnderWriterDocumentModel.Status.valueOf(request.getStatus()));
            }
            doc.setReplyMessage(request.getReplyMessage()); // may be null

            if (request.getMediaUrls() != null) {
                for (String url : request.getMediaUrls()) {
                    if (url == null || url.isBlank()) continue;
                    MediaUrlModel media = new MediaUrlModel();
                    media.setUrl(url);
                    doc.addMediaUrl(media);
                }
            }

            UnderWriterDocumentModel saved = documentRepository.save(doc);
            return toResponseDTO(saved);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create document: " + e.getMessage(), e);
        }
    }

    @Override
    public List<UnderWriterDocumentResponseDTO> getAll() {
        try {
            List<UnderWriterDocumentModel> docs = documentRepository.findAll();
            return docs.stream().map(this::toResponseDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch documents: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<UnderWriterDocumentResponseDTO> getById(Long id) {
        try {
            return documentRepository.findById(id).map(this::toResponseDTO);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch document: " + e.getMessage(), e);
        }
    }

    @Override
    public Optional<UnderWriterDocumentResponseDTO> update(Long id, UnderWriterDocumentRequestDTO request) {
        try {
            return documentRepository.findById(id).map(existing -> {
                existing.setCustomerEmail(request.getCustomerEmail());
                if (request.getStatus() != null && !request.getStatus().isBlank()) {
                    existing.setStatus(UnderWriterDocumentModel.Status.valueOf(request.getStatus()));
                }
                existing.setReplyMessage(request.getReplyMessage());

                // replace media urls
                existing.clearMediaUrls();
                if (request.getMediaUrls() != null) {
                    for (String url : request.getMediaUrls()) {
                        if (url == null || url.isBlank()) continue;
                        MediaUrlModel media = new MediaUrlModel();
                        media.setUrl(url);
                        existing.addMediaUrl(media);
                    }
                }
                UnderWriterDocumentModel saved = documentRepository.save(existing);
                return toResponseDTO(saved);
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to update document: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean delete(Long id) {
        try {
            if (documentRepository.existsById(id)) {
                documentRepository.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete document: " + e.getMessage(), e);
        }
    }

    private UnderWriterDocumentResponseDTO toResponseDTO(UnderWriterDocumentModel model) {
        UnderWriterDocumentResponseDTO dto = new UnderWriterDocumentResponseDTO();
        dto.setId(model.getId());
        dto.setCustomerEmail(model.getCustomerEmail());
        dto.setStatus(model.getStatus().name());
        dto.setReplyMessage(model.getReplyMessage());
        List<String> urls = new ArrayList<>();
        if (model.getMediaUrls() != null) {
            for (MediaUrlModel m : model.getMediaUrls()) {
                urls.add(m.getUrl());
            }
        }
        dto.setMediaUrls(urls);
        return dto;
    }
}