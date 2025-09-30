package com.example.secrud.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "underwriter_documents")
public class UnderWriterDocumentModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(length = 2000)
    private String replyMessage; // default null

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MediaUrlModel> mediaUrls = new ArrayList<>();

    public enum Status {
        PENDING,
        IN_REVIEW,
        APPROVED,
        REJECTED
    }

    public UnderWriterDocumentModel() {}

    public UnderWriterDocumentModel(Long id, String customerEmail, Status status, String replyMessage) {
        this.id = id;
        this.customerEmail = customerEmail;
        this.status = status;
        this.replyMessage = replyMessage;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getReplyMessage() { return replyMessage; }
    public void setReplyMessage(String replyMessage) { this.replyMessage = replyMessage; }

    public List<MediaUrlModel> getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(List<MediaUrlModel> mediaUrls) { this.mediaUrls = mediaUrls; }

    // helpers
    public void addMediaUrl(MediaUrlModel mediaUrl) {
        mediaUrl.setDocument(this);
        this.mediaUrls.add(mediaUrl);
    }

    public void clearMediaUrls() {
        for (MediaUrlModel m : new ArrayList<>(mediaUrls)) {
            m.setDocument(null);
        }
        mediaUrls.clear();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UnderWriterDocumentModel that = (UnderWriterDocumentModel) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }
}