-- ============================================================
-- Seed Data for Modular Component Showcase
-- ============================================================

-- Insert roles
INSERT INTO roles (name) VALUES ('USER'), ('ADMIN')
ON CONFLICT (name) DO NOTHING;

-- Insert default admin user (password: admin123 - BCrypt hash)
INSERT INTO users (name, email, password, role_id)
SELECT 'Admin User', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       (SELECT id FROM roles WHERE name = 'ADMIN')
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

-- Insert default regular user (password: user123)
INSERT INTO users (name, email, password, role_id)
SELECT 'Regular User', 'user@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       (SELECT id FROM roles WHERE name = 'USER')
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@example.com');

-- Insert sample components
INSERT INTO showcase_components (name, category, description, code_snippet, status, created_by)
SELECT 'Primary Button', 'Buttons', 'A standard primary action button with hover effects.',
       '<button class=\"btn btn-primary\">Click Me</button>', 'active',
       (SELECT id FROM users WHERE email = 'admin@example.com')
WHERE NOT EXISTS (SELECT 1 FROM showcase_components WHERE name = 'Primary Button');

INSERT INTO showcase_components (name, category, description, code_snippet, status, created_by)
SELECT 'Outline Button', 'Buttons', 'An outlined button variant for secondary actions.',
       '<button class=\"btn btn-outline\">Secondary</button>', 'active',
       (SELECT id FROM users WHERE email = 'admin@example.com')
WHERE NOT EXISTS (SELECT 1 FROM showcase_components WHERE name = 'Outline Button');

INSERT INTO showcase_components (name, category, description, code_snippet, status, created_by)
SELECT 'Info Card', 'Cards', 'A card component for displaying informational content.',
       '<div class=\"card\"><h3>Title</h3><p>Content here</p></div>', 'active',
       (SELECT id FROM users WHERE email = 'admin@example.com')
WHERE NOT EXISTS (SELECT 1 FROM showcase_components WHERE name = 'Info Card');

INSERT INTO showcase_components (name, category, description, code_snippet, status, created_by)
SELECT 'Modal Dialog', 'Modals', 'A reusable modal dialog with overlay and close button.',
       '<div class=\"modal-overlay\"><div class=\"modal\"><button class=\"close\">&times;</button></div></div>', 'active',
       (SELECT id FROM users WHERE email = 'admin@example.com')
WHERE NOT EXISTS (SELECT 1 FROM showcase_components WHERE name = 'Modal Dialog');

INSERT INTO showcase_components (name, category, description, code_snippet, status, created_by)
SELECT 'Data Table', 'Tables', 'A responsive data table with sorting and pagination.',
       '<table class=\"data-table\"><thead><tr><th>Name</th><th>Value</th></tr></thead></table>', 'active',
       (SELECT id FROM users WHERE email = 'admin@example.com')
WHERE NOT EXISTS (SELECT 1 FROM showcase_components WHERE name = 'Data Table');
