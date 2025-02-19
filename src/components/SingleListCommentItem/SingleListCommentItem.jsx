import './SingleListCommentItem.css';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { fetchDisplayNameByUserId } from '../../api/db-service';
import { formatTimestamp } from '../../utils/utils';
function SingleListCommentItem({ commentObject }) {
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
    </div>
  );
}

SingleListCommentItem.propTypes = {
  commentObject: PropTypes.object,
};

export default SingleListCommentItem;
