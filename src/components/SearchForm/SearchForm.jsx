import { useState, useRef, useEffect } from "react";
import { searchUsersByUsername } from "../../api/db-service";
import { Link } from "react-router-dom";
import Button from "../Button/Button"; 
import "./SearchForm.css";

const SearchForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setLoading(true);
    const results = await searchUsersByUsername(searchQuery);
    setUsers(results);
    setLoading(false);
    setShowResults(true);
  };

  // Close search results when clicking outside the search container
  const handleClickOutside = (e) => {
    if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
      setShowResults(false);
    }
  };

  //This useEffect hook listens for clicks outside the search container and closes the search results when the user clicks outside the search container.
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    // Remove the event listener when the component unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-container" ref={searchContainerRef}>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
        <Button 
          className="search-button" 
          type="submit" 
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      {showResults && (
        <div className="search-results">
          {users.length > 0 ? (
            users.map((user) => (
              <Link key={user.uid} to={`/user/${user.uid}`} className="user-card">
                <img
                  src={user.profilePicture || "/default-avatar.jpg"}
                  alt={user.username}
                  className="user-avatar"
                />
                <p className="user-name">{user.username}</p>
              </Link>
            ))
          ) : (
            <p className="no-results">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchForm;
