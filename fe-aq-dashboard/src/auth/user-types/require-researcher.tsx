import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store";

const RequireResearcher = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>; // or your spinner
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "researcher") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RequireResearcher;
