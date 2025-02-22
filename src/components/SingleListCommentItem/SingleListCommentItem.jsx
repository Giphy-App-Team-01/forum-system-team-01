import './SingleListCommentItem.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { fetchDisplayNameByUserId } from '../../api/db-service';
import { formatTimestamp } from '../../utils/utils';
import Button from '../Button/Button';
import './SingleListCommentItem.css';
import { useNavigate } from 'react-router-dom';
function SingleListCommentItem({ commentObject, onDelete }) {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      const username = await fetchDisplayNameByUserId(commentObject.authorId);
      setUserName(username);
    };
    if (commentObject.authorId) {
      fetchUsername();
    }
  }, [commentObject]);
  return (
    <div className='comment-card-single-post'>
      <p className='comment-text'>{commentObject.content}</p>
      <div className='homepage-footer'>
        <span className='comment-author' onClick={() => navigate(`/user/${commentObject.authorId}`)}>By {userName}</span>
        <span className='comment-date'>📅 {formatTimestamp(commentObject.createdAt)}</span>
      </div>
      <Button className='delete-comment danger' onClickHandler={onDelete}>
        Delete
      </Button>
    </div>
  );
}

SingleListCommentItem.propTypes = {
  commentObject: PropTypes.object,
  onDelete: PropTypes.func,
};

export default SingleListCommentItem;
