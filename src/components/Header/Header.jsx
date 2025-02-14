import StatsBar from '../StatsBar/StatsBar';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import './Header.css';
import Container from '../Container/Container';

function Header() {
  return (
    <header className='header'>
      <Container>
        <nav className='nav'>
          {/* Forum Title */}
          <h1 className='forum-title'>JS Dev Forum</h1>

          {/* Navigation Links */}
          <ul className='nav-links'>
            <li>
              <Link to='/' className='nav-link'>
                Home
              </Link>
            </li>
            <li>
              <Link to='/all-posts/' className='nav-link'>
                All Posts
              </Link>
            </li>
            <li>
              <Link to='/create-post/' className='nav-link'>
                Create Post
              </Link>
            </li>
            <li>
              <Link to='/about/' className='nav-link'>
                About
              </Link>
            </li>
            <li>
              <Link to='/user/' className='nav-link'>
                User Profile
              </Link>
            </li>
          </ul>

          {/* Authentication Buttons */}
          <div className='auth-buttons'>
            <Button className='login-button'>Login</Button>
            <Button className='register-button'>Register</Button>
          </div>
        </nav>
      </Container>

      {/* Forum Stats */}
      <StatsBar totalRegisteredUsers={0} totalPostsCreated={0} />
    </header>
  );
}

export default Header;
