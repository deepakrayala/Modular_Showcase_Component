package com.showcase.service;

import com.showcase.dto.ComponentRequest;
import com.showcase.dto.ComponentResponse;
import com.showcase.model.ShowcaseComponent;
import com.showcase.model.User;
import com.showcase.repository.ComponentRepository;
import com.showcase.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComponentService {

    private final ComponentRepository componentRepository;
    private final UserRepository userRepository;

    public ComponentService(ComponentRepository componentRepository, UserRepository userRepository) {
        this.componentRepository = componentRepository;
        this.userRepository = userRepository;
    }

    public List<ComponentResponse> getAllComponents() {
        return componentRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ComponentResponse> getComponentsByCategory(String category) {
        return componentRepository.findByCategory(category).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ComponentResponse getComponentById(Integer id) {
        ShowcaseComponent component = componentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Component not found"));
        return toResponse(component);
    }

    public ComponentResponse createComponent(ComponentRequest request, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ShowcaseComponent component = new ShowcaseComponent(
                request.getName(),
                request.getCategory(),
                request.getDescription(),
                request.getCodeSnippet(),
                request.getStatus(),
                user
        );

        component = componentRepository.save(component);
        return toResponse(component);
    }

    public ComponentResponse updateComponent(Integer id, ComponentRequest request) {
        ShowcaseComponent component = componentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Component not found"));

        component.setName(request.getName());
        component.setCategory(request.getCategory());
        component.setDescription(request.getDescription());
        component.setCodeSnippet(request.getCodeSnippet());
        component.setStatus(request.getStatus());

        component = componentRepository.save(component);
        return toResponse(component);
    }

    public void deleteComponent(Integer id) {
        ShowcaseComponent component = componentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Component not found"));
        componentRepository.delete(component);
    }

    private ComponentResponse toResponse(ShowcaseComponent c) {
        return new ComponentResponse(
                c.getId(), c.getName(), c.getCategory(), c.getDescription(),
                c.getCodeSnippet(), c.getStatus(),
                c.getCreatedBy() != null ? c.getCreatedBy().getId() : null,
                c.getCreatedBy() != null ? c.getCreatedBy().getName() : null,
                c.getCreatedAt(), c.getUpdatedAt()
        );
    }
}
