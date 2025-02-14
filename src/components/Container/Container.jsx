import PropTypes from 'prop-types';
import './Container.css';
function Container({ children, extraClassName = '' }) {
  return <div className={`container ${extraClassName}`}>{children}</div>;
}

Container.propTypes = {
  children: PropTypes.node,
  extraClassName: PropTypes.string,
};

export default Container;
