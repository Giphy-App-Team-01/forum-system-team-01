import StatsBar from '../StatsBar/StatsBar';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
function Header() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/all-posts/'>All Posts</Link>
          </li>
          <li>
            <Link to='/create-post/'>Create Post</Link>
          </li>
          <li>
            <Link to='/about/'>About</Link>
          </li>
          <li>
            <Link to='/user/'>User Profile</Link>
          </li>
        </ul>
        <Button className='login' onClickHandler={() => {}}>
          Login
        </Button>

        <Button className='register' onClickHandler={() => {}}>
          Register
        </Button>
      </nav>
      <StatsBar totalRegisteredUsers={0} totalPostsCreated={0} />
    </div>
  );
}

export default Header;
