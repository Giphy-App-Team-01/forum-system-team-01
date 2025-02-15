import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/app.context";
import PropTypes from "prop-types";

export default function Authenticated({ children }) {
  const { authUser } = useContext(AppContext); 


  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

Authenticated.propTypes = {
  children: PropTypes.node.isRequired,
};
