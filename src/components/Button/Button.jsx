import './Button.css';
import PropTypes from 'prop-types';
function Button({ className, onClickHandler, children }) {
  return (
    <button className={className} onClick={onClickHandler}>
      {children}
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  onClickHandler: PropTypes.func,
  children: PropTypes.node,
};

export default Button;
