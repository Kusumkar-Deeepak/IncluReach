import { createContext, useState, useContext } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

// Create a custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Enhanced login function
  const login = (userData, token) => {
    try {
      if (!userData || !token) {
        throw new Error("Invalid user data or token");
      }

      // Normalize user data structure
      const normalizedUser = {
        id: userData._id || userData.id,
        email: userData.email,
        fullName: userData.fullName,
        // Add any other necessary fields
      };

      // Update state and localStorage
      setUser(normalizedUser);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("token", token);

      // Verify storage
      if (!localStorage.getItem("token")) {
        throw new Error("Failed to store token");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to complete login");
      // Clean up if partial storage occurred
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  };

  // Enhanced updateUser function
  const updateUser = (updatedUser, token) => {
    try {
      if (!updatedUser) {
        throw new Error("Invalid user data");
      }

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (token) {
        localStorage.setItem("token", token);
      }
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  // Enhanced logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        isAuthenticated: !!localStorage.getItem("token"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;