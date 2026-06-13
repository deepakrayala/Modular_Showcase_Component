const componentsData = [
  {
    id: "button",
    name: "Button",
    category: "Input",
    description:
      "Versatile button component with multiple variants, sizes, and states. Supports primary, secondary, outline, ghost, and danger styles.",
    tags: ["click", "action", "submit", "form", "ui"],
    props: [
      { name: "variant", type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "primary" },
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "md" },
      { name: "disabled", type: "boolean", default: "false" },
      { name: "loading", type: "boolean", default: "false" },
      { name: "fullWidth", type: "boolean", default: "false" },
      { name: "onClick", type: "function", default: "—" },
      { name: "children", type: "ReactNode", default: "—" },
    ],
    usage: `<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>`,
  },
  {
    id: "card",
    name: "Card",
    category: "Layout",
    description:
      "Flexible card container for grouping related content. Includes support for headers, footers, images, and hover effects.",
    tags: ["container", "layout", "content", "display", "ui"],
    props: [
      { name: "title", type: "string", default: "—" },
      { name: "subtitle", type: "string", default: "—" },
      { name: "image", type: "string", default: "—" },
      { name: "footer", type: "ReactNode", default: "—" },
      { name: "hoverable", type: "boolean", default: "true" },
      { name: "children", type: "ReactNode", default: "—" },
    ],
    usage: `<Card
  title="Card Title"
  subtitle="Optional subtitle"
  image="https://via.placeholder.com/300x200"
  footer={<button>Action</button>}
>
  Card content goes here.
</Card>`,
  },
  {
    id: "modal",
    name: "Modal",
    category: "Overlay",
    description:
      "Accessible modal dialog for confirmations, forms, and detailed content. Supports custom sizes, close-on-overlay, and keyboard dismissal.",
    tags: ["dialog", "popup", "overlay", "confirmation", "alert"],
    props: [
      { name: "isOpen", type: "boolean", default: "false" },
      { name: "onClose", type: "function", default: "—" },
      { name: "title", type: "string", default: "—" },
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "md" },
      { name: "closeOnOverlay", type: "boolean", default: "true" },
      { name: "children", type: "ReactNode", default: "—" },
    ],
    usage: `<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  <p>Modal content here.</p>
</Modal>`,
  },
  {
    id: "form",
    name: "Form",
    category: "Input",
    description:
      "Feature-rich form component with built-in validation, error handling, and support for various input types including text, email, password, select, and textarea.",
    tags: ["input", "validation", "submit", "field", "data-entry"],
    props: [
      { name: "fields", type: "array", default: "—" },
      { name: "onSubmit", type: "function", default: "—" },
      { name: "validationRules", type: "object", default: "—" },
      { name: "submitLabel", type: "string", default: "'Submit'" },
      { name: "loading", type: "boolean", default: "false" },
    ],
    usage: `<Form
  fields={[
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
  ]}
  onSubmit={(data) => console.log(data)}
  validationRules={{
    email: { required: true, pattern: /^\\S+@\\S+$/ }
  }}
/>`,
  },
  {
    id: "table",
    name: "Table",
    category: "Data Display",
    description:
      "Dynamic data table with sorting, filtering, pagination, and customizable column rendering. Handles large datasets efficiently.",
    tags: ["data", "grid", "list", "sort", "filter", "pagination"],
    props: [
      { name: "columns", type: "array", default: "—" },
      { name: "data", type: "array", default: "—" },
      { name: "pageSize", type: "number", default: "10" },
      { name: "sortable", type: "boolean", default: "true" },
      { name: "searchable", type: "boolean", default: "true" },
      { name: "onRowClick", type: "function", default: "—" },
    ],
    usage: `<Table
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
    { key: 'email', label: 'Email' },
  ]}
  data={[
    { name: 'John', age: 30, email: 'john@example.com' },
  ]}
  pageSize={10}
/>`,
  },
  {
    id: "badge",
    name: "Badge",
    category: "Data Display",
    description:
      "Small label component for statuses, counts, and notifications. Available in multiple colors and variants.",
    tags: ["label", "tag", "status", "notification", "count"],
    props: [
      { name: "variant", type: "'success' | 'warning' | 'error' | 'info' | 'neutral'", default: "neutral" },
      { name: "size", type: "'sm' | 'md'", default: "sm" },
      { name: "children", type: "ReactNode", default: "—" },
    ],
    usage: `<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>`,
  },
  {
    id: "accordion",
    name: "Accordion",
    category: "Layout",
    description:
      "Collapsible content panels for organizing information in a compact space. Supports single and multiple expansion modes.",
    tags: ["collapse", "expand", "faq", "toggle", "organize"],
    props: [
      { name: "items", type: "array", default: "—" },
      { name: "allowMultiple", type: "boolean", default: "false" },
      { name: "defaultOpen", type: "array", default: "[]" },
    ],
    usage: `<Accordion
  items={[
    { title: 'Section 1', content: 'Content 1' },
    { title: 'Section 2', content: 'Content 2' },
  ]}
  allowMultiple={false}
/>`,
  },
  {
    id: "tabs",
    name: "Tabs",
    category: "Navigation",
    description:
      "Tabbed navigation component for switching between different views or content sections within the same page.",
    tags: ["navigation", "switch", "content", "sections", "views"],
    props: [
      { name: "tabs", type: "array", default: "—" },
      { name: "defaultActive", type: "string", default: "—" },
      { name: "onChange", type: "function", default: "—" },
      { name: "variant", type: "'underline' | 'pills' | 'buttons'", default: "underline" },
    ],
    usage: `<Tabs
  tabs={[
    { id: 'tab1', label: 'Tab 1', content: <p>Content 1</p> },
    { id: 'tab2', label: 'Tab 2', content: <p>Content 2</p> },
  ]}
  defaultActive="tab1"
  variant="underline"
/>`,
  },
  {
    id: "tooltip",
    name: "Tooltip",
    category: "Overlay",
    description:
      "Informative popover that appears on hover, focus, or click. Supports multiple positions and custom content.",
    tags: ["popover", "hint", "info", "hover", "help"],
    props: [
      { name: "content", type: "ReactNode", default: "—" },
      { name: "position", type: "'top' | 'bottom' | 'left' | 'right'", default: "top" },
      { name: "trigger", type: "'hover' | 'click'", default: "hover" },
      { name: "children", type: "ReactNode", default: "—" },
    ],
    usage: `<Tooltip content="Helpful information" position="top">
  <button>Hover me</button>
</Tooltip>`,
  },
  {
    id: "progress",
    name: "Progress Bar",
    category: "Feedback",
    description:
      "Visual indicator of task or operation progress. Supports determinate and indeterminate modes with customizable colors and labels.",
    tags: ["loading", "status", "indicator", "percentage", "bar"],
    props: [
      { name: "value", type: "number", default: "0" },
      { name: "max", type: "number", default: "100" },
      { name: "label", type: "string", default: "—" },
      { name: "variant", type: "'primary' | 'success' | 'warning' | 'error'", default: "primary" },
      { name: "showValue", type: "boolean", default: "true" },
    ],
    usage: `<ProgressBar value={75} max={100} variant="primary" showValue={true} />`,
  },
  {
    id: "toast",
    name: "Toast",
    category: "Feedback",
    description:
      "Temporary notification that slides in to provide feedback on user actions. Supports success, error, warning, and info variants.",
    tags: ["notification", "alert", "snackbar", "message", "feedback"],
    props: [
      { name: "message", type: "string", default: "—" },
      { name: "variant", type: "'success' | 'error' | 'warning' | 'info'", default: "info" },
      { name: "duration", type: "number", default: "3000" },
      { name: "onClose", type: "function", default: "—" },
    ],
    usage: `<Toast message="Action completed successfully!" variant="success" duration={3000} />`,
  },
  {
    id: "avatar",
    name: "Avatar",
    category: "Data Display",
    description:
      "Circular avatar component for user profiles. Supports images, initials fallback, and online/offline status indicators.",
    tags: ["profile", "user", "image", "photo", "initial"],
    props: [
      { name: "src", type: "string", default: "—" },
      { name: "alt", type: "string", default: "—" },
      { name: "size", type: "'sm' | 'md' | 'lg' | 'xl'", default: "md" },
      { name: "status", type: "'online' | 'offline' | 'away' | 'busy'", default: "—" },
      { name: "fallback", type: "string", default: "—" },
    ],
    usage: `<Avatar
  src="https://i.pravatar.cc/150"
  alt="User Name"
  size="lg"
  status="online"
/>`,
  },
  {
    id: "dropdown",
    name: "Dropdown",
    category: "Navigation",
    description:
      "Contextual menu that reveals a list of actions or options on click or hover. Supports nested menus and custom rendering.",
    tags: ["menu", "select", "options", "actions", "context"],
    props: [
      { name: "trigger", type: "ReactNode", default: "—" },
      { name: "items", type: "array", default: "—" },
      { name: "position", type: "'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'", default: "bottom-left" },
      { name: "onItemClick", type: "function", default: "—" },
    ],
    usage: `<Dropdown
  trigger={<button>Menu</button>}
  items={[
    { label: 'Profile', onClick: () => {} },
    { label: 'Settings', onClick: () => {} },
    { type: 'divider' },
    { label: 'Logout', onClick: () => {}, danger: true },
  ]}
/>`,
  },
  {
    id: "toggle",
    name: "Toggle Switch",
    category: "Input",
    description:
      "Binary switch component for enabling/disabling settings or toggling between two states with smooth animation.",
    tags: ["switch", "boolean", "on-off", "enable", "setting"],
    props: [
      { name: "checked", type: "boolean", default: "false" },
      { name: "onChange", type: "function", default: "—" },
      { name: "label", type: "string", default: "—" },
      { name: "disabled", type: "boolean", default: "false" },
      { name: "size", type: "'sm' | 'md'", default: "md" },
    ],
    usage: `<ToggleSwitch
  checked={isEnabled}
  onChange={setIsEnabled}
  label="Enable notifications"
  size="md"
/>`,
  },
  {
    id: "pagination",
    name: "Pagination",
    category: "Navigation",
    description:
      "Page navigation component for splitting large datasets across multiple pages. Includes page numbers, prev/next buttons, and ellipsis.",
    tags: ["pages", "navigation", "prev", "next", "data"],
    props: [
      { name: "currentPage", type: "number", default: "1" },
      { name: "totalPages", type: "number", default: "—" },
      { name: "onPageChange", type: "function", default: "—" },
      { name: "showFirstLast", type: "boolean", default: "true" },
    ],
    usage: `<Pagination
  currentPage={page}
  totalPages={20}
  onPageChange={(p) => setPage(p)}
/>`,
  },
  {
    id: "chip",
    name: "Chip",
    category: "Data Display",
    description:
      "Compact element representing an input, attribute, or action. Supports removable chips, icon-leading chips, and selection states.",
    tags: ["tag", "filter", "attribute", "removable", "compact"],
    props: [
      { name: "label", type: "string", default: "—" },
      { name: "onRemove", type: "function", default: "—" },
      { name: "icon", type: "ReactNode", default: "—" },
      { name: "variant", type: "'filled' | 'outlined'", default: "filled" },
      { name: "selected", type: "boolean", default: "false" },
    ],
    usage: `<Chip label="React" onRemove={() => {}} variant="filled" />
<Chip label="Selected" selected={true} />`,
  },
];

export const categories = [
  { id: "input", name: "Input", icon: "⌨️", description: "Form controls and data entry components" },
  { id: "layout", name: "Layout", icon: "📐", description: "Structural and container components" },
  { id: "navigation", name: "Navigation", icon: "🧭", description: "Menus, tabs, and page navigation" },
  { id: "overlay", name: "Overlay", icon: "🪟", description: "Modals, tooltips, and popovers" },
  { id: "feedback", name: "Feedback", icon: "💬", description: "Progress, notifications, and alerts" },
  { id: "data-display", name: "Data Display", icon: "📊", description: "Tables, badges, and data visualization" },
];

export default componentsData;
