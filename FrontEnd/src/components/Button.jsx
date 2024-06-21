import PropTypes from "prop-types";

const Button = ({ className, onClick, text }) => {
  return (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default Button;