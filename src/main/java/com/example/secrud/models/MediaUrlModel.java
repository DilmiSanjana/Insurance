package com.example.secrud.models;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "underwriter_media_urls")
public class MediaUrlModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private UnderWriterDocumentModel document;

    public MediaUrlModel() {}

    public MediaUrlModel(Long id, String url) {
        this.id = id;
        this.url = url;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public UnderWriterDocumentModel getDocument() { return document; }
    public void setDocument(UnderWriterDocumentModel document) { this.document = document; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MediaUrlModel that = (MediaUrlModel) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }
}