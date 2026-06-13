import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import componentsData, { categories } from "../data/componentsData";
import "./ComponentsList.css";

export default function ComponentsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  const [sortBy, setSortBy] = useState("name");

  const filteredComponents = useMemo(() => {
    let result = [...componentsData];

    // Filter by category
    if (selectedCategory !== "all") {
      const catObj = categories.find((c) => c.id === selectedCategory);
      if (catObj) {
        result = result.filter((comp) => comp.category === catObj.name);
      }
    }

    // Search filter (intelligent search across name, description, tags, category)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (comp) =>
          comp.name.toLowerCase().includes(query) ||
          comp.description.toLowerCase().includes(query) ||
          comp.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          comp.category.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category") {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    navigate(`/components?category=${catId}`, { replace: true });
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    navigate("/components", { replace: true });
  };

  return (
    <div className="components-list-page">
      <div className="list-header">
        <h1>Components Library</h1>
        <p className="list-subtitle">
          Browse, search, and explore {componentsData.length} reusable UI
          components
        </p>
      </div>

      {/* Search and Filters */}
      <div className="list-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, description, tag, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== "all" || searchQuery) && (
        <div className="active-filters">
          <span className="filter-label">Active filters:</span>
          {selectedCategory !== "all" && (
            <span className="filter-tag">
              {categories.find((c) => c.id === selectedCategory)?.name ||
                selectedCategory}
              <button onClick={() => handleCategoryChange("all")}>✕</button>
            </span>
          )}
          {searchQuery && (
            <span className="filter-tag">
              &ldquo;{searchQuery}&rdquo;
              <button onClick={() => setSearchQuery("")}>✕</button>
            </span>
          )}
          <button className="clear-filters" onClick={clearFilters}>
            Clear all
          </button>
        </div>
      )}

      {/* Results */}
      {filteredComponents.length === 0 ? (
        <div className="no-results">
          <span className="no-results-icon">🔍</span>
          <h3>No components found</h3>
          <p>
            Try adjusting your search or filter criteria to find what you&apos;re
            looking for.
          </p>
          <button className="btn-reset" onClick={clearFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <p className="results-count">
            Showing {filteredComponents.length} of {componentsData.length}{" "}
            components
          </p>

          <div className="components-grid">
            {filteredComponents.map((comp) => (
              <div
                key={comp.id}
                className="component-card"
                onClick={() => navigate(`/components/${comp.id}`)}
              >
                <div className="card-header">
                  <h3>{comp.name}</h3>
                  <span className="card-category">{comp.category}</span>
                </div>
                <p className="card-description">{comp.description}</p>
                <div className="card-tags">
                  {comp.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="card-tag">
                      {tag}
                    </span>
                  ))}
                  {comp.tags.length > 4 && (
                    <span className="card-tag more">+{comp.tags.length - 4}</span>
                  )}
                </div>
                <span className="card-action">View Details →</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
