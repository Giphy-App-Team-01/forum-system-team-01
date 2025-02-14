import StatsBar from '../StatsBar/StatsBar';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import './Header.css';
import Container from '../Container/Container';
import SearchForm from '../SearchForm/SearchForm';

function Header() {
  return (
    <>
      <header className='header'>
        <Container>
          <nav className='nav'>
            <h1 className='forum-title'>JS Dev Forum</h1>
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
              <li></li>
            </ul>
          </nav>
          <div className='utils-header'>
            <SearchForm />
            <div className='action-buttons'>
              <Link to='/user/' className='nav-link'>
                <div className='icon-box user-box'>
                  <i className='fa-solid fa-user'></i>
                </div>
              </Link>
            </div>
            <div className='auth-buttons'>
              <Button
                className='primary login-button'
                onClickHandler={() => {}}
              >
                Login
              </Button>
              <Button
                className='secondary register-button'
                onClickHandler={() => {}}
              >
                Register
              </Button>
            </div>
          </div>
        </Container>
      </header>
      <StatsBar totalRegisteredUsers={0} totalPostsCreated={0} />
    </>
  );
}

export default Header;
