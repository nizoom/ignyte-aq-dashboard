//a user is required - doesn't matter which kind
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store";

const RequireAuth = () => {
  const { firebaseUser, loading } = useAuthStore();

  if (loading) return <div>Loading...</div>;

  return firebaseUser ? <Outlet /> : <Navigate to="/" replace />;
};

export default RequireAuth;
