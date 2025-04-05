import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";

import AuthProvider, { AuthContext } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProfileEdit from "./pages/ProfileEdit";
import Applications from "./pages/Applications";
import ApplicationDetails from "./pages/ApplicationDetails";
import JobsList from "./pages/JobsList";
import CreateJob from "./pages/CreateJob";
import JobDetail from "./pages/JobDetail";
import MyJobs from "./pages/MyJobs";
import SelectedJobsPage from "./pages/SelectedJobsPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/profile/edit"
              element={<ProtectedRoute element={<ProfileEdit />} />}
            />
            <Route
              path="/dashboard/applications"
              element={<ProtectedRoute element={<Applications />} />}
            />
            <Route
              path="/dashboard/applications/:id"
              element={<ProtectedRoute element={<ApplicationDetails />} />}
            />
            <Route
              path="/dashboard/selected-jobs"
              element={<ProtectedRoute element={<SelectedJobsPage />} />}
            />
            <Route path="/jobs" element={<JobsList />} />
            <Route
              path="/jobs/new"
              element={<ProtectedRoute element={<CreateJob />} />}
            />
            <Route
              path="/jobs/:id"
              element={<ProtectedRoute element={<JobDetail />} />}
            />
            <Route
              path="/jobs/my-jobs"
              element={<ProtectedRoute element={<MyJobs />} />}
            />
            {/* Your other routes */}
            <Route path="/uploads/*" element={null} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
