import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/app.context";
import { listenToTopCommentedPosts, listenToLatestPosts, getUserData } from "../../api/db-service"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

const Home = () => {
  const { authUser } = useContext(AppContext);
  const [topCommentedPosts, setTopCommentedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [authorNames, setAuthorNames] = useState({}); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeTop = listenToTopCommentedPosts(setTopCommentedPosts);
    const unsubscribeLatest = listenToLatestPosts(setLatestPosts);

    return () => {
      unsubscribeTop();
      unsubscribeLatest();
    };
  }, []);

  const fetchAuthorName = async (authorId) => {
    if (!authorId || authorNames[authorId]) return;

    const userData = await getUserData(authorId);
      setAuthorNames((prev) => ({ ...prev, [authorId]: userData.firstName + " " + userData.lastName }));

  };

  useEffect(() => {
    [...topCommentedPosts, ...latestPosts].forEach((post) => {
      if (post.authorId) {
        fetchAuthorName(post.authorId);
      }
    });
  }, [topCommentedPosts, latestPosts]);

  const handlePostClick = (postId) => {
    if (!authUser) {
      toast.error("You must be logged in to view this post!");
      return;
    }
    navigate(`/post/${postId}`);
  };

  return (
    <div className="homepage-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="homepage-sections">
        <div className="homepage-block most-commented">
          <h2>🔥 Top 10 Most Commented Posts</h2>
          {topCommentedPosts.length > 0 ? (
            topCommentedPosts.map((post) => (
              <div
                key={post.postId}
                className={`homepage-card most-commented-card`}
                onClick={() => handlePostClick(post.postId)}
              >
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 70)}...</p>
                <div className="homepage-footer">
                  <span>By {authorNames[post.authorId]}</span>
                  <span>💬 {post.commentCount} comments</span>
                </div>
              </div>
            ))
          ) : (
            <p>No popular posts yet.</p>
          )}
        </div>

        <div className="homepage-block newest-posts">
          <h2>🆕 Latest 10 Posts</h2>
          {latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <div
                key={post.postId}
                className={`homepage-card newest-post-card ${!authUser ? "homepage-disabled" : ""}`}
                onClick={() => handlePostClick(post.postId)}
              >
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 70)}...</p>
                <div className="homepage-footer">
                  <span>By {authorNames[post.authorId]}</span>
                  <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No recent posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
