import StatsBar from '../StatsBar/StatsBar';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import './Header.css';
import Container from '../Container/Container';
import SearchForm from '../SearchForm/SearchForm';
import { AppContext } from '../../context/app.context';
import { useContext } from 'react';
import { logoutUser } from '../../api/auth-service';

function Header() {
  const { authUser, dbUser } = useContext(AppContext);
  const navigate = useNavigate();

  const navigateLogin = () => {
    navigate('/login/');
  };

  const navigateRegister = () => {
    navigate('/register/');
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <>
      <header className="header">
        <Container>
          <nav className="nav">
            <h1 className="forum-title">JS Dev Forum</h1>
            <ul className="nav-links">
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>
                {authUser && (
                  <Link to="/all-posts/" className="nav-link">
                    All Posts
                  </Link>
                )}
              </li>
              <li>
                {authUser && (
                  <Link to="/create-post/" className="nav-link">
                    Create Post
                  </Link>
                )}
              </li>
              <li>
                <Link to="/about/" className="nav-link">
                  About
                </Link>
              </li>
              <li></li>
            </ul>
          </nav>
          <div className="utils-header">
            {dbUser?.isAdmin && <SearchForm />}
            <div className="action-buttons">
              <Link to={`/user/${authUser.uid}`} className="nav-link">
                <div className="icon-box user-box">
                  <i className="fa-solid fa-user"></i>
                </div>
              </Link>
            </div>
            <div className="auth-buttons">
              {!authUser ? (
                <>
                  <Button
                    className="primary login-button"
                    onClickHandler={navigateLogin}
                  >
                    Login
                  </Button>
                  <Button
                    className="secondary register-button"
                    onClickHandler={navigateRegister}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="logout-button"
                    onClickHandler={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </Container>
      </header>
      <StatsBar totalRegisteredUsers={0} totalPostsCreated={0} />
    </>
  );
}

export default Header;
