package com.example.secrud.dto;

import java.util.List;

public class UnderWriterDocumentRequestDTO {
    private String customerEmail;
    private String status; // optional, defaults to PENDING if null/blank
    private String replyMessage; // optional
    private List<String> mediaUrls; // list of URL strings

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReplyMessage() { return replyMessage; }
    public void setReplyMessage(String replyMessage) { this.replyMessage = replyMessage; }

    public List<String> getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(List<String> mediaUrls) { this.mediaUrls = mediaUrls; }
}