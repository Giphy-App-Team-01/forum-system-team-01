import './PostSingleView.css';
import { getSinglePostDetails } from '../../api/db-service';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
function PostSingleView({ id }) {
  const [postObject, setPostObject] = useState(null);
  const fetchSinglePostInfo = async () => {
    const postInfo = await getSinglePostDetails(id);
    setPostObject(postInfo);
    console.log(postInfo);
  };
  useEffect(() => {
    fetchSinglePostInfo();
  }, [id]);
  return (
    postObject && (
      <article className='single-post'>
        <h1>{postObject.title}</h1>
        <div className='author-info__single-post'>
          <img
            src='../../src/assets/default-avatar.jpg'
            alt={postObject.username}
            className='author-info__single-post'
          />
          <div className='author-info__single-post'></div>
          <h4>{postObject.userId}</h4>
        </div>
      </article>
    )
  );
}

PostSingleView.propTypes = {
  id: PropTypes.string,
};

export default PostSingleView;
