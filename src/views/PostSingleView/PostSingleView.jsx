import './PostSingleView.css';
import { getSinglePostDetails } from '../../api/db-service';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/app.context';
import PropTypes from 'prop-types';
function PostSingleView() {
  const [postObject, setPostObject] = useState(null);
  const { id } = useParams();
  const { authUser, dbUser } = useContext(AppContext);

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

  console.log(authUser);
  return (
    postObject && (
      <article className='single-post'>
        <h1>{postObject.title}</h1>
        <div className='author-info__single-post'>
          <img
            src='../../src/assets/images/default-avatar.jpg'
            alt={postObject.username}
            className='author-info__single-post'
          />
          <div className='author-info__single-post'></div>
          <h4>{postObject.userId}</h4>
          {authUser.uid === postObject.authorId && <button>edit</button>}
          {dbUser.isAdmin && <button>delete</button>}
        </div>
      </article>
    )
  );
}

PostSingleView.propTypes = {
  id: PropTypes.string,
};

export default PostSingleView;
