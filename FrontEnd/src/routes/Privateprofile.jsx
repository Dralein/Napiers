import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const Privateprofile = ({ children }) => {
  const logged = useSelector((state) => state.login.logged);

  if (logged === false) {
    return <Navigate to="/login" />;
  }

  return children;
};

Privateprofile.propTypes = {
  children: PropTypes.node,
};

export default Privateprofile;
