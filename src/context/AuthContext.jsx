import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

// All API calls go through the FastAPI Gateway
const GATEWAY_URL = "http://127.0.0.1:8000";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

const [user, setUser] = useState(null);
const [token, setToken] = useState(localStorage.getItem("token"));
const [serverOnline, setServerOnline] = useState(null);
const [loading, setLoading] = useState(true);

  // Restore user from token on mount
  useEffect(() => {
  const storedToken = localStorage.getItem("token");

  if (storedToken) {
    try {
      const payload = JSON.parse(
        atob(storedToken.split(".")[1])
      );

      console.log("RESTORED JWT:", payload);

      setToken(storedToken);

      setUser({
        id: payload.userId,
        email: payload.sub,
        roleName: payload.role,
        roleId:
          payload.role?.toLowerCase() === "admin"
            ? 2
            : 1,
        name: localStorage.getItem("userName") || "User",
      });

    } catch (e) {
      console.log("JWT RESTORE ERROR:", e);

      localStorage.removeItem("token");
      localStorage.removeItem("userName");

      setToken(null);
      setUser(null);
    }
  }

  setLoading(false);
}, []);

  // CHECK GATEWAY SERVER
  const checkServer = async () => {
    try {
      const response = await fetch(`${GATEWAY_URL}/health`);
      if (!response.ok) throw new Error("Server offline");
      const data = await response.json();
      setServerOnline(data.gateway === "ok");
    } catch (error) {
      console.error("Gateway Check Error:", error);
      setServerOnline(false);
    }
  };

  // AUTO CHECK SERVER
  useEffect(() => {
    checkServer();
    const interval = setInterval(checkServer, 5000);
    return () => clearInterval(interval);
  }, []);

  // LOGIN — goes through FastAPI Gateway
  const login = async (email, password) => {
    try {
      const response = await fetch(`${GATEWAY_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = "Invalid email or password";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }

      if (data.user) {
        localStorage.setItem("userName", data.user.name);
        setUser(data.user);
      }

      return data;

    } catch (error) {
      console.error("Login Error:", error);
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        throw new Error("Gateway server is offline.");
      }
      throw error;
    }
  };

  // SIGNUP — goes through FastAPI Gateway
  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${GATEWAY_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        let errorMessage = "Signup failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      return await response.json();

    } catch (error) {
      console.error("Signup Error:", error);
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        throw new Error("Gateway server is offline.");
      }
      throw error;
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken(null);
    setUser(null);
  };

  // AUTH FETCH — helper for authenticated requests
  const authFetch = async (url, options = {}) => {
  const headers = {
    ...options.headers,
  };

  const currentToken = localStorage.getItem("token");

  console.log("TOKEN SENT:", currentToken);

  if (currentToken) {
    headers["Authorization"] = `Bearer ${currentToken}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        serverOnline,
        checkServer,
        authFetch,
        GATEWAY_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
