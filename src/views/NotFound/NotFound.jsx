import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>
        The page you&apos;re looking for doesn&apos;t exist or has been moved. 
        Let&apos;s get you back on track!
      </p>
      <Link to="/" className="home-button">
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
