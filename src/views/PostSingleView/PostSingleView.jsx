import './PostSingleView.css';
import { getSinglePostDetails } from '../../api/db-service';
import Button from '../../components/Button/Button';
import { formatTimestamp } from '../../utils/utils';
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/app.context';
import PropTypes from 'prop-types';
function PostSingleView() {
  const navigate = useNavigate();
  const [postObject, setPostObject] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const { id } = useParams();
  const { authUser, dbUser } = useContext(AppContext);

  const handleUsernameClick = () => {
    navigate(`/user/${postObject.authorId}`);
  };

  useEffect(() => {
    if (!id) return;

    const fetchSinglePostInfo = async () => {
      try {
        const postInfo = await getSinglePostDetails(id);
        setPostObject(postInfo);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchSinglePostInfo();
  }, [id]);
  console.log(postObject);
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
              src='../../src/assets/images/default-avatar.jpg'
              alt={postObject.authorId}
              className='author-info__single-post'
            />
            <div className='username__single-post'>{postObject.authorId}</div>
          </div>

          <div className='date-created__single-post'>
            {formatTimestamp(postObject.createdAt)}
          </div>
        </div>
        <div className='content__single-post'>
          <textarea
            disabled
            className='content-textarea__single-post'
            value={postObject.content}
          />
        </div>
        <div className='controls__single-post'>
          {authUser.uid === postObject.authorId && (
            <Button className='warning' onClickHandler={() => {}}>
              Edit
            </Button>
          )}
          {dbUser.isAdmin && (
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
      </article>
    )
  );
}

PostSingleView.propTypes = {
  id: PropTypes.string,
};

export default PostSingleView;
