import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import staticComponentsData from "../data/componentsData";
import { useAuth } from "../context/AuthContext";
import "./ComponentsList.css";

// Comprehensive categories covering both static library + admin-added components
const ALL_CATEGORIES = [
  { id: "input", name: "Input", icon: "⌨️", description: "Form controls and data entry" },
  { id: "layout", name: "Layout", icon: "📐", description: "Structural and container components" },
  { id: "navigation", name: "Navigation", icon: "🧭", description: "Menus, tabs, and page navigation" },
  { id: "overlay", name: "Overlay", icon: "🪟", description: "Modals, tooltips, and popovers" },
  { id: "feedback", name: "Feedback", icon: "💬", description: "Progress, notifications, and alerts" },
  { id: "data-display", name: "Data Display", icon: "📊", description: "Tables, badges, and data viz" },
  { id: "buttons", name: "Buttons", icon: "🔘", description: "Clickable action buttons" },
  { id: "cards", name: "Cards", icon: "🃏", description: "Card and container layouts" },
  { id: "modals", name: "Modals", icon: "🪟", description: "Dialog and overlay components" },
  { id: "forms", name: "Forms", icon: "📝", description: "Form and input components" },
  { id: "tables", name: "Tables", icon: "📋", description: "Data tables and grids" },
  { id: "badges", name: "Badges", icon: "🏷️", description: "Labels, tags, and status badges" },
  { id: "alerts", name: "Alerts", icon: "⚠️", description: "Alert and notification components" },
  { id: "spinners", name: "Spinners", icon: "⏳", description: "Loading and progress indicators" },
  { id: "typography", name: "Typography", icon: "🔤", description: "Text and heading components" },
  { id: "icons", name: "Icons", icon: "🎨", description: "Icon and symbol components" },
  { id: "other", name: "Other", icon: "📦", description: "Miscellaneous components" },
];

// Map category names to their ID for filtering
function getCategoryId(categoryName) {
  const cat = ALL_CATEGORIES.find(
    (c) => c.name.toLowerCase() === (categoryName || "").toLowerCase()
  );
  return cat ? cat.id : "other";
}

// Normalize MongoDB component to match static component shape
function normalizeMongoComponent(mongoComp) {
  return {
    id: `mongo-${mongoComp._id}`,
    name: mongoComp.name || "Untitled",
    category: mongoComp.category || "Other",
    description: mongoComp.description || "",
    tags: mongoComp.tags || [],
    props: [],
    usage: mongoComp.codeSnippet || "",
    _source: "mongodb",
    _mongoId: mongoComp._id,
  };
}

export default function ComponentsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { GATEWAY_URL } = useAuth();
  const activeCategory = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  const [sortBy, setSortBy] = useState("name");

  // MongoDB components state
  const [mongoComponents, setMongoComponents] = useState([]);
  const [loadingMongo, setLoadingMongo] = useState(true);
  const [mongoError, setMongoError] = useState("");

  // Fetch MongoDB components on mount
  useEffect(() => {
    async function fetchMongoComponents() {
      try {
        const res = await fetch(`${GATEWAY_URL}/api/mongo/components`);
        if (res.ok) {
          const data = await res.json();
          setMongoComponents((data || []).map(normalizeMongoComponent));
        } else {
          setMongoError("MongoDB components unavailable");
        }
      } catch {
        setMongoError("MongoDB backend offline");
      } finally {
        setLoadingMongo(false);
      }
    }
    fetchMongoComponents();
  }, [GATEWAY_URL]);

  // Merge static + MongoDB components
  const allComponents = useMemo(() => {
    return [...staticComponentsData, ...mongoComponents];
  }, [mongoComponents]);

  // Derive available categories dynamically from all components
  const availableCategoryIds = useMemo(() => {
    const used = new Set(allComponents.map((c) => getCategoryId(c.category)));
    return ALL_CATEGORIES.filter((c) => used.has(c.id));
  }, [allComponents]);

  const filteredComponents = useMemo(() => {
    let result = [...allComponents];

    // Filter by category
    if (selectedCategory !== "all") {
      const catObj = ALL_CATEGORIES.find((c) => c.id === selectedCategory);
      if (catObj) {
        result = result.filter(
          (comp) =>
            comp.category.toLowerCase() === catObj.name.toLowerCase()
        );
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (comp) =>
          comp.name.toLowerCase().includes(query) ||
          comp.description.toLowerCase().includes(query) ||
          (comp.tags || []).some((tag) => tag.toLowerCase().includes(query)) ||
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
  }, [selectedCategory, searchQuery, sortBy, allComponents]);

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
          Browse, search, and explore {allComponents.length} reusable UI
          components
          {mongoComponents.length > 0 &&
            ` (${mongoComponents.length} from MongoDB)`}
        </p>
      </div>

      {/* Server status indicator */}
      {mongoError && (
        <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
          ⚠ MongoDB: {mongoError} — only showing static components
        </div>
      )}
      {loadingMongo && (
        <div
          className="alert"
          style={{
            marginBottom: "1rem",
            background: "#f0f9ff",
            color: "#0369a1",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            fontSize: "0.85rem",
          }}
        >
          Loading MongoDB components...
        </div>
      )}

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
            {availableCategoryIds.map((cat) => (
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
              {ALL_CATEGORIES.find((c) => c.id === selectedCategory)?.name ||
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
            Try adjusting your search or filter criteria to find what
            you&apos;re looking for.
          </p>
          <button className="btn-reset" onClick={clearFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <p className="results-count">
            Showing {filteredComponents.length} of {allComponents.length}{" "}
            components
          </p>

          <div className="components-grid">
            {filteredComponents.map((comp) => (
              <div
                key={comp.id}
                className={`component-card ${
                  comp._source === "mongodb" ? "card-mongodb" : ""
                }`}
                onClick={() => {
                  if (comp._source === "mongodb") {
                    navigate(`/components/mongo/${comp._mongoId}`, {
                      state: { mongoComponent: comp },
                    });
                  } else {
                    navigate(`/components/${comp.id}`);
                  }
                }}
              >
                <div className="card-header">
                  <h3>
                    {comp.name}
                    {comp._source === "mongodb" && (
                      <span className="mongo-badge" title="Added via Admin">
                        +
                      </span>
                    )}
                  </h3>
                  <span className="card-category">{comp.category}</span>
                </div>
                <p className="card-description">{comp.description}</p>
                <div className="card-tags">
                  {(comp.tags || []).slice(0, 4).map((tag) => (
                    <span key={tag} className="card-tag">
                      {tag}
                    </span>
                  ))}
                  {(comp.tags || []).length > 4 && (
                    <span className="card-tag more">
                      +{comp.tags.length - 4}
                    </span>
                  )}
                </div>
                <span className="card-action">
                  {comp._source === "mongodb" ? "View Code →" : "View Details →"}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
