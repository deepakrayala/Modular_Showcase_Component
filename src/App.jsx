import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ComponentsList from "./pages/ComponentsList";
import ComponentDetail from "./pages/ComponentDetail";
import AdminPage from "./pages/AdminPage";
import AdminAddComponent from "./pages/AdminAddComponent";
import "./App.css";

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/components"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ComponentsList />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/components/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ComponentDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/components/mongo/:mongoId"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ComponentDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-component"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminAddComponent />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
