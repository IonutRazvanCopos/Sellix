import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";

interface Props {
  children: JSX.Element;
}

function userProfileRoute({ children }: Props) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default userProfileRoute;