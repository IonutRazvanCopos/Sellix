import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";

interface Props {
  children: JSX.Element;
}

function PublicRoute({ children }: Props) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PublicRoute;