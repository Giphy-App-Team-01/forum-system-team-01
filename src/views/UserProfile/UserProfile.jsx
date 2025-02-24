import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/app.context';
import {
  getUserData,
  updateUserData,
  getUserPosts,
  getUserCommentsWithPostTitles,
  updateUserRole,
  blockUser,
} from '../../api/db-service';
import './UserProfile.css';
import Button from '../../components/Button/Button';

const UserProfile = () => {
  const { userId: id } = useParams();
  const { authUser, dbUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!id) {
      console.error('❌ User ID is undefined!');
      return;
    }

    const fetchUserData = async () => {
      const userData = await getUserData(id);

      if (!userData) {
        navigate('/not-found');
        return;
      }
      
      if (userData) {
        setUser(userData);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
      }

      const userPosts = await getUserPosts(id);
      setPosts(userPosts || []);

      const userComments = await getUserCommentsWithPostTitles(id);
      setComments(userComments || []);
    };

    fetchUserData();
  }, [id]);

  const handleEdit = () => setEditing(true);

  const handleSave = async () => {
    await updateUserData(id, { firstName, lastName });
    setUser({ ...user, firstName, lastName });
    setEditing(false);
  };

  const handleBlockUser = async () => {
    const newStatus = user.isBlocked ? null : true;
    await blockUser(id, newStatus);
    setUser((prev) => ({ ...prev, isBlocked: newStatus }));
  };

  const handleToggleAdmin = async () => {
    const newStatus = user.isAdmin ? null : true;
    await updateUserRole(id, newStatus);
    setUser((prev) => ({ ...prev, isAdmin: newStatus }));
  };

  // Filtering posts by search query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Filtering comments by search query
  const filteredComments = comments.filter((comment) =>
    comment.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Sorting data (posts or comments) by date (newest or oldest)
  const sortedData = (data) =>
    data.sort((a, b) =>
      sortOrder === 'newest'
        ? b.createdAt - a.createdAt
        : a.createdAt - b.createdAt
    );

  return (
    <div className='user-profile'>
      {user ? (
        <>
          <div className='profile-header'>
            <img
              src={user.profilePicture || '/default-avatar.jpg'}
              alt='Avatar'
              className='profile-avatar'
            />
            {editing ? (
              <>
                <input
                  type='text'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type='text'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <Button className='save-button' onClickHandler={handleSave}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <h2>
                  {user.firstName} {user.lastName}
                </h2>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>{user.email}</p>
                {authUser?.uid === id && (
                  <Button className='edit-button' onClickHandler={handleEdit}>
                    Edit
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Buttons for blocking and promoting users (this buttons are visible only for admins and is visible only for other users profile) */}
          {dbUser?.isAdmin && authUser?.uid !== id && (
            <div className='profile-actions'>
              <Button
                className={
                  user.isBlocked
                    ? 'block-button unblock-user'
                    : 'block-button block-user'
                }
                onClickHandler={handleBlockUser}
              >
                {user.isBlocked ? 'Unblock User' : 'Block User'}
              </Button>
              <Button
                className={
                  user.isAdmin
                    ? 'admin-button remove-admin'
                    : 'admin-button make-admin'
                }
                onClickHandler={handleToggleAdmin}
              >
                {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
              </Button>
            </div>
          )}

          {/* Навигация между постове и коментари */}
          <div className='profile-tabs'>
            <Button
              className={activeTab === 'posts' ? 'active' : ''}
              onClickHandler={() => setActiveTab('posts')}
            >
              {authUser?.uid === id ? 'My Posts' : 'Posts'}
            </Button>
            <Button
              className={activeTab === 'comments' ? 'active' : ''}
              onClickHandler={() => setActiveTab('comments')}
            >
              {authUser?.uid === id ? 'My Comments' : 'Comments'}
            </Button>
          </div>

          {/* Search and sort controls */}
          <div className='sort-controls'>
            <input
              type='text'
              className='search-input'
              placeholder='Search by title or comments...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <label>Sort by:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value='newest'>Newest</option>
              <option value='oldest'>Oldest</option>
            </select>
          </div>

          {/* Show posts or comments */}
          {activeTab === 'comments' ? (
            <div className='comments-list'>
              {filteredComments.length > 0 ? (
                sortedData(filteredComments).map((comment) => (
                  <div
                    key={comment.commentId}
                    className='comment-card'
                    onClick={() => navigate(`/post/${comment.postId}`)}
                  >
                    <h3 className='comment-post-title'>
                      📝 <strong>{comment.postTitle || 'Unknown Post'}</strong>
                    </h3>
                    <p className='comment-content'>
                      <strong>Your comment:</strong> {comment.content.substring(0, 100)}...
                    </p>
                  </div>
                ))
              ) : (
                <p className='no-content'>No comments found.</p>
              )}
            </div>
          ) : (
            <div className='posts-list'>
              {filteredPosts.length > 0 ? (
                sortedData(filteredPosts).map((post) => (
                  <div
                    key={post.postId}
                    className='post-card'
                    onClick={() => navigate(`/post/${post.postId}`)}
                  >
                    <h3>{post.title}</h3>
                    <p>{post.content.substring(0, 100)}...</p>
                  </div>
                ))
              ) : (
                <p className='no-content'>No posts found.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
