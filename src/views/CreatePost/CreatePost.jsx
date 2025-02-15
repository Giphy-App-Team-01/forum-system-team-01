import { useState, useContext } from "react";
import { AppContext } from "../../context/app.context";
import { savePostToDatabase } from "../../api/db-service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreatePost.css";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const { authUser, dbUser } = useContext(AppContext);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigateToProfile = () => {
    navigation(`/user/${authUser.uid}`);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.title.length < 16 || formData.title.length > 64) {
      toast.error("Title must be between 16 and 64 characters long.");
      return;
    }
    if (formData.content.length < 32 || formData.content.length > 8192) {
      toast.error("Content must be between 32 and 8192 characters long.");
      return;
    }

    try {
      setLoading(true);
      await savePostToDatabase(authUser.uid, formData.title, formData.content);
      toast.success("Post created successfully!");
      setFormData({ title: "", content: "" });
    } catch (error) {
      toast.error("Error creating post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-wrapper">
      <ToastContainer />
      <div className="create-post-container">
        <h2>Create Post</h2>

        <div className="post-header">
          <img
            src={dbUser?.profilePicture}
            alt="User Avatar"
            className="user-avatar"
            onClick={navigateToProfile}
          />
          <p className="user-name">{dbUser?.firstName} {dbUser?.lastName}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Enter an engaging title..."
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            placeholder="Share your thoughts..."
            value={formData.content}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
