import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Privateadmin = ({ children }) => {
  const admin = useSelector((state) => state.login.admin);
  if (admin === false) {
    return <Navigate to="/profile" />;
  }

  return children;
};

Privateadmin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Privateadmin;
