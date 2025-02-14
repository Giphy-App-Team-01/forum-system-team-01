import PropTypes from 'prop-types';
import './StatsBar.css';
import Container from '../Container/Container';

function StatsBar({ totalRegisteredUsers, totalPostsCreated }) {
  return (
    <Container>
      <div className='stats-bar'>
        <div className='stats-bar__item'>
          <span className='stats-bar__item-value'>{totalRegisteredUsers}</span>
          <span className='stats-bar__item-label'>Registered Users</span>
        </div>
        <div className='stats-bar__item'>
          <span className='stats-bar__item-value'>{totalPostsCreated}</span>
          <span className='stats-bar__item-label'>Posts Created</span>
        </div>
      </div>
    </Container>
  );
}

StatsBar.propTypes = {
  totalRegisteredUsers: PropTypes.number,
  totalPostsCreated: PropTypes.number,
};

export default StatsBar;
