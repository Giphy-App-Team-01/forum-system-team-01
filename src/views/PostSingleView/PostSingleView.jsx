import './PostSingleView.css';
import {
  getUserProfilePicture,
  getUserData,
  getSinglePostDetails,
} from '../../api/db-service';
import Button from '../../components/Button/Button';
import { formatTimestamp } from '../../utils/utils';
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/app.context';
import PropTypes from 'prop-types';
function PostSingleView() {
  const navigate = useNavigate();
  const [postObject, setPostObject] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [postContentValue, setPostContentValue] = useState('');
  const { id } = useParams();
  const { authUser, dbUser } = useContext(AppContext);

  const handleEditClick = () => {
    setIsEditable(true);
  };
  const handleUsernameClick = () => {
    navigate(`/user/${postObject.authorId}`);
  };

  useEffect(() => {
    if (!id) return;

    const fetchSinglePostInfo = async () => {
      try {
        const postInfo = await getSinglePostDetails(id);
        const postAuthorImage = await getUserProfilePicture(postInfo.authorId);
        const currentUserName = await getUserData(postInfo.authorId);
        setCurrentUsername(currentUserName);
        setPostObject(postInfo);
        setUserProfilePicture(postAuthorImage);
        setPostContentValue(postInfo.content);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchSinglePostInfo();
  }, [id]);
  return (
    postObject && (
      <article className='single-post'>
        <h1>{postObject.title}</h1>
        <div className='author-info__single-post'>
          <div
            className='username-info__single-post'
            onClick={handleUsernameClick}
          >
            <img
              src={userProfilePicture}
              alt={postObject.authorId}
              className='author-info__single-post'
            />
            <div className='username__single-post'>
              {currentUsername?.username}
            </div>
          </div>

          <div className='date-created__single-post'>
            {formatTimestamp(postObject.createdAt)}
          </div>
        </div>
        <div className='content__single-post'>
          {isEditable && (
            <textarea
              className='content-textarea__single-post editable'
              value={postContentValue}
              onChange={(e) => setPostContentValue(e.target.value)}
            ></textarea>
          )}
          {!isEditable && (
            <textarea
              disabled={!isEditable}
              className='content-textarea__single-post'
              value={postContentValue}
            />
          )}
        </div>
        <div className='controls__single-post'>
          <div className='author-admin__controls'>
            {authUser.uid === postObject.authorId && !isEditable && (
              <Button className='warning' onClickHandler={handleEditClick}>
                Edit
              </Button>
            )}
            {dbUser.isAdmin && !isEditable && (
              <Button className='danger' onClickHandler={() => {}}>
                Delete
              </Button>
            )}
            {isEditable && (
              <Button className='success' onClickHandler={() => {}}>
                Save Changes
              </Button>
            )}
          </div>
          <div className='public__controls'>
            <div className='vote-controls'>
              <div className='option__vote-controls'>
                <i className='fa-solid fa-thumbs-up'></i>
                <span>0</span>
              </div>
              <div className='option__vote-controls'>
                <i className='fa-solid fa-thumbs-down'></i>
                <span>0</span>
              </div>
            </div>
            <div className='reply-button'>
              <Button onClickHandler={() => {}}>Reply</Button>
            </div>
          </div>
        </div>
      </article>
    )
  );
}

PostSingleView.propTypes = {
  id: PropTypes.string,
};

export default PostSingleView;
