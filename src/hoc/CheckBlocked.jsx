import { useContext } from "react";
import { AppContext } from "../context/app.context";
import Blocked from "../views/Blocked/Blocked";
import PropTypes from "prop-types";

const CheckBlocked = ({ children }) => {
  // Get the user data from the context
  const { dbUser } = useContext(AppContext);

  // If the user is blocked, show the Blocked component
  if (dbUser?.isBlocked) {
    return <Blocked />;
  }

  return <>{children}</>;
};

export default CheckBlocked;


CheckBlocked.propTypes = {
    children: PropTypes.node.isRequired,
};