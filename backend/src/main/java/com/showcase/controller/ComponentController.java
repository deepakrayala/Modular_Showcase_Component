package com.showcase.controller;

import com.showcase.dto.ComponentRequest;
import com.showcase.dto.ComponentResponse;
import com.showcase.dto.ErrorResponse;
import com.showcase.security.JwtUserPrincipal;
import com.showcase.service.ComponentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/components")
public class ComponentController {

    private final ComponentService componentService;

    public ComponentController(ComponentService componentService) {
        this.componentService = componentService;
    }

    @GetMapping
    public ResponseEntity<?> getAllComponents(
            @RequestParam(required = false) String category) {
        try {
            List<ComponentResponse> components;
            if (category != null && !category.isEmpty()) {
                components = componentService.getComponentsByCategory(category);
            } else {
                components = componentService.getAllComponents();
            }
            return ResponseEntity.ok(components);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to fetch components"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComponentById(@PathVariable("id") Integer id) {
        try {
            ComponentResponse component = componentService.getComponentById(id);
            return ResponseEntity.ok(component);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createComponent(
            @Valid @RequestBody ComponentRequest request,
            @AuthenticationPrincipal JwtUserPrincipal principal) {
        try {
            ComponentResponse response = componentService.createComponent(request, principal.getUserId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateComponent(
            @PathVariable("id") Integer id,
            @Valid @RequestBody ComponentRequest request) {
        try {
            ComponentResponse response = componentService.updateComponent(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteComponent(@PathVariable("id") Integer id) {
        try {
            componentService.deleteComponent(id);
            return ResponseEntity.ok(new java.util.LinkedHashMap<>() {{
                put("message", "Component deleted successfully");
            }});
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
}
