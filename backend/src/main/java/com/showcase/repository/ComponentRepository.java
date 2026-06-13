package com.showcase.repository;

import com.showcase.model.ShowcaseComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComponentRepository extends JpaRepository<ShowcaseComponent, Integer> {
    List<ShowcaseComponent> findByCategory(String category);
    List<ShowcaseComponent> findByStatus(String status);
    List<ShowcaseComponent> findByNameContainingIgnoreCase(String name);
}
