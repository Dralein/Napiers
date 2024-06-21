import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Privatelogin = ({ children }) => {
  const logged = useSelector((state) => state.login.logged);
  if (logged === true) {
    return <Navigate to="/profile" />;
  } 

  return children;
};

Privatelogin.propTypes = {
  children: PropTypes.node,
};

export default Privatelogin;