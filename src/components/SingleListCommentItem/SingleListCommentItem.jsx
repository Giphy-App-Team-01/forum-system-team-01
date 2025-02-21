import './SingleListCommentItem.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { fetchDisplayNameByUserId } from '../../api/db-service';
import { formatTimestamp } from '../../utils/utils';
import Button from '../Button/Button';
function SingleListCommentItem({ commentObject, onDelete }) {
  const [userName, setUserName] = useState('');

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
    <div className='homepage-card most-commented-card'>
      <p>{commentObject.content}</p>
      <div className='homepage-footer'>
        <span>By {userName}</span>
        <span>📅 {formatTimestamp(commentObject.createdAt)}</span>
      </div>
      <button className='delete-comment danger'>Delete</button>
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
