package com.showcase.dto;

import jakarta.validation.constraints.NotBlank;

public class ComponentRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    private String description;

    private String codeSnippet;

    @NotBlank(message = "Status is required")
    private String status;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCodeSnippet() { return codeSnippet; }
    public void setCodeSnippet(String codeSnippet) { this.codeSnippet = codeSnippet; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
