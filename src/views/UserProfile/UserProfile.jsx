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
import { uploadImageToCloudinary } from '../../api/upload-service';

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
  const [imageFile, setImageFile] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

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

      setUser(userData);
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setPhoneNumber(userData.phoneNumber || '');

      const userPosts = await getUserPosts(id);
      setPosts(userPosts || []);

      const userComments = await getUserCommentsWithPostTitles(id);
      setComments(userComments || []);
    };

    fetchUserData();
  }, [id]);

  const handleEdit = () => setEditing(true);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file)); //Create a temporary URL for the image to preview
    }
  };

  const handleSave = async () => {
    let updatedData = { firstName, lastName };

    // Check if there is a new image to upload
    if (imageFile) {
      const newImageUrl = await uploadImageToCloudinary(imageFile);

      // Compare the new image URL with the current one
      if (newImageUrl && newImageUrl !== user.profilePicture) {
        updatedData.profilePicture = newImageUrl;
      }
    }

    // If the user is an admin he can add a phone number
    if (dbUser?.isAdmin) {
      updatedData.phoneNumber = phoneNumber || null; // if phoneNumber is empty, set it to null (remove it from the DB)
    }

    try {
      await updateUserData(id, updatedData);
      setUser({ ...user, ...updatedData });
      setPreviewImage(null);
      setImageFile(null);
    } catch (error) {
      console.log(`Error updating user data: ${error.message}`);
    } finally {
      setEditing(false);
    }
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
              src={previewImage || user.profilePicture || '/default-avatar.jpg'}
              alt='Avatar'
              className='profile-avatar'
            />
            {editing ? (
              <>
                <div className='profile-avatar-upload'>
                  <label htmlFor='file-upload' className='custom-file-upload'>
                    📸 Upload New Picture
                  </label>
                  <input
                    id='file-upload'
                    type='file'
                    accept='image/*'
                    onChange={(e) => handleImageChange(e)}
                  />
                </div>
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

                {dbUser?.isAdmin && (
                  <input
                    type='number'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder='Phone Number (Admins Only)'
                  />
                )}
                <Button className='success' onClickHandler={handleSave}>
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
                <p>
                  <strong>Email: </strong>
                  {user.email}
                </p>
                <p>
                  {phoneNumber !== '' && (
                    <p>
                      <strong>Phone Number:</strong> {user.phoneNumber}
                    </p>
                  )}
                </p>
                {authUser?.uid === id && (
                  <Button className='warning' onClickHandler={handleEdit}>
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
                      <strong>Your comment:</strong>{' '}
                      {comment.content.substring(0, 100)}...
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
