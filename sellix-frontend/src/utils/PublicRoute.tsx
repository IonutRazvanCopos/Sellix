import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";

interface Props {
  children: JSX.Element;
}

const PublicRoute = ({ children }: Props) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Navigate to="/auctions" /> : children;
};

export default PublicRoute;