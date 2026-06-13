import { useState, useMemo } from "react";

const sampleData = [
  { id: 1, name: "Alice Johnson", age: 28, email: "alice@example.com", role: "Developer", status: "Active" },
  { id: 2, name: "Bob Smith", age: 35, email: "bob@example.com", role: "Designer", status: "Active" },
  { id: 3, name: "Carol White", age: 42, email: "carol@example.com", role: "Manager", status: "Inactive" },
  { id: 4, name: "David Brown", age: 31, email: "david@example.com", role: "Developer", status: "Active" },
  { id: 5, name: "Eve Davis", age: 26, email: "eve@example.com", role: "Designer", status: "Active" },
  { id: 6, name: "Frank Miller", age: 45, email: "frank@example.com", role: "Manager", status: "Inactive" },
  { id: 7, name: "Grace Wilson", age: 29, email: "grace@example.com", role: "Developer", status: "Active" },
  { id: 8, name: "Henry Taylor", age: 38, email: "henry@example.com", role: "Developer", status: "Active" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
];

export default function TableShowcase() {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const filtered = useMemo(() => {
    let data = [...sampleData];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (row) =>
          row.name.toLowerCase().includes(q) ||
          row.email.toLowerCase().includes(q) ||
          row.role.toLowerCase().includes(q)
      );
    }
    if (sortKey) {
      data.sort((a, b) => {
        const va = a[sortKey];
        const vb = b[sortKey];
        if (typeof va === "string") {
          return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
        }
        return sortDir === "asc" ? va - vb : vb - va;
      });
    }
    return data;
  }, [searchTerm, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  return (
    <div className="showcase-component">
      <div className="showcase-preview">
        <div className="preview-area" style={{ flexDirection: "column" }}>
          <div className="table-controls-bar">
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="table-search"
            />
            <span className="table-count">{filtered.length} records</span>
          </div>

          <div className="table-wrapper">
            <table className="demo-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{ cursor: "pointer" }}
                    >
                      {col.label}{" "}
                      {sortKey === col.key
                        ? sortDir === "asc"
                          ? "▲"
                          : "▼"
                        : "⇅"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.age}</td>
                    <td>{row.email}</td>
                    <td>{row.role}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          row.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-pagination">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Prev
            </button>
            <span>
              Page {page} of {totalPages || 1}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <div className="showcase-controls">
        <p className="control-hint">
          Click column headers to sort. Use the search box to filter data.
          Pagination controls at the bottom.
        </p>
      </div>
    </div>
  );
}
