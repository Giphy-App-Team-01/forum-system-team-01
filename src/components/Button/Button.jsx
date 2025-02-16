import PropTypes from "prop-types";
import "./Button.css";

function Button({ className, onClickHandler, children, type = "button" }) {
  return (
    <button className={className} onClick={onClickHandler} type={type}>
      {children}
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  onClickHandler: PropTypes.func,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};

export default Button;
