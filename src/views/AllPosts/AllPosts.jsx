import { useState, useEffect } from "react";
import { getAllPosts, getUserData } from "../../api/db-service"; 
import { useNavigate } from "react-router-dom";
import "./AllPosts.css"; 

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); 
  const [searchValue, setSearchValue] = useState("");
  const [sortOption, setSortOption] = useState("newest"); 
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsData = await getAllPosts();
      
        const postsWithUsernames = await Promise.all(
          postsData.map(async (post) => {
            const userData = await getUserData(post.authorId); 
            return { 
              ...post, 
              authorName: userData.username 
            };
          })
        );

        setPosts(postsWithUsernames);
        setFilteredPosts(postsWithUsernames);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    let result = [...posts];

    if (searchValue.trim() !== "") {
      result = result.filter((post) =>
        post.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (sortOption === "newest") {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortOption === "oldest") {
      result.sort((a, b) => a.createdAt - b.createdAt);
    }

    setFilteredPosts(result);
  }, [searchValue, sortOption, posts]);

  return (
    <div className="all-posts-container">
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by title or comments..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <div className="sort-container">
          <label>Sort by:</label>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
      <div className="posts-list">
        {filteredPosts.map((post) => (
          <div 
            className="post-item" 
            key={post.postId} 
            onClick={() => navigate(`/post/${post.postId}`)}
          >
            <h2>{post.title}</h2>
            <p>{post.content.substring(0, 60)}...</p>
            <div className="post-footer">
              <span>By {post.authorName}</span>
              <span>{post.commentCount} comments</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllPosts;
