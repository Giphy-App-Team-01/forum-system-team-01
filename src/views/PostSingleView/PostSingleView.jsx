import './PostSingleView.css';
import {
  getUserProfilePicture,
  getUserData,
  getSinglePostDetails,
  updatePostInfo,
  deletePostById,
  updateCommentCount,
  addCommentToPostById,
  subscribeToComments,
  deleteCommentById,
  updateLikesDislikes,
} from '../../api/db-service';
import SingleListCommentItem from '../../components/SingleListCommentItem/SingleListCommentItem';
import { MIN_CONTENT_CHARS, MAX_CONTENT_CHARS } from '../../common/constants';
import CommentForm from '../../components/CommentForm/CommentForm';
import { validatePostContent } from '../../utils/validationHelpers';
import Button from '../../components/Button/Button';
import { formatTimestamp } from '../../utils/utils';
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/app.context';
import PropTypes from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function PostSingleView() {
  const navigate = useNavigate();
  const [postObject, setPostObject] = useState(null);
  const [postContentLength, setPostContentLength] = useState(0);
  const [postLikes, setPostLikes] = useState(0);
  const [postDislikes, setPostDislikes] = useState(0);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [postContentValue, setPostContentValue] = useState('');
  const [postComments, setPostComments] = useState([]);
  const [commentContentValue, setCommentContentValue] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const { id } = useParams();
  const { authUser, dbUser } = useContext(AppContext);

  const handleEditClick = () => {
    setIsEditable(true);
  };
  const handleUsernameClick = () => {
    navigate(`/user/${postObject.authorId}`);
  };

  const handleLikesDislikesClick = (type) => {
    // if (postObject.usersVoted[authUser.uid]) return;
    if (type === 'likes') {
      setPostLikes((prev) => {
        const updatedLikes = prev + 1;
        updateLikesDislikes(id, updatedLikes, postDislikes, authUser.uid, type); // Pass updated likes
        return updatedLikes;
      });
    } else if (type === 'dislikes') {
      setPostDislikes((prev) => {
        const updatedDislikes = prev + 1;
        updateLikesDislikes(id, postLikes, updatedDislikes, authUser.uid, type); // Pass updated dislikes
        return updatedDislikes;
      });
    }
  };

  const handleAddNewComment = async () => {
    try {
      addCommentToPostById(
        id,
        authUser.uid,
        commentContentValue,
        new Date().getTime()
      );
      setShowCommentForm(false);
      toast.success('Comment added successfully!');
      setCommentContentValue('');
    } catch (err) {
      toast.error('Error adding comment.');
      console.error('Error adding comment:', err);
    }
  };

  const handlePostDelete = async () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this post?'
    );

    if (isConfirmed) {
      try {
        await deletePostById(id);
        toast.success('✅ Post deleted!');
        navigate(`/user/${authUser.uid}`);
      } catch (error) {
        toast.error('❌ Error deleting post');
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleUpdatePost = async () => {
    try {
      if (!validatePostContent(postContentValue)) {
        toast.error(
          `Content must be at least ${MIN_CONTENT_CHARS} characters long.`
        );
        return;
      }
      await updatePostInfo(id, postContentValue);
      setIsEditable(false);
      toast.success('Post updated successfully!');
    } catch (error) {
      toast.error('Error updating post.');
      console.error('Error updating post:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentById(commentId);
      toast.success('Comment deleted successfully!');
    } catch (error) {
      toast.error('Error deleting comment.');
      console.error('Error deleting comment:', error);
    }
  };

  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeToComments(setPostComments);
    const fetchSinglePostInfo = async () => {
      try {
        const postInfo = await getSinglePostDetails(id);
        const postAuthorImage = await getUserProfilePicture(postInfo.authorId);
        const currentUserName = await getUserData(postInfo.authorId);
        setCurrentUsername(currentUserName);
        setPostObject(postInfo);
        setPostLikes(postInfo.likes);
        setPostDislikes(postInfo.dislikes);
        setUserProfilePicture(postAuthorImage);
        setPostContentValue(postInfo.content);
        setPostContentLength(postInfo.content.length);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchSinglePostInfo();
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    updateCommentCount(id, postComments.length);
  }, [postComments]);

  console.log(postLikes, postDislikes);

  return (
    postObject && (
      <>
        <article className='single-post'>
          <ToastContainer />
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
              <div className='edit-post-box'>
                <textarea
                  className='content-textarea__single-post editable'
                  value={postContentValue}
                  onChange={(e) => {
                    setPostContentValue(e.target.value);
                    setPostContentLength(e.target.value.length);
                  }}
                  maxLength={MAX_CONTENT_CHARS}
                ></textarea>
                <span className='content-chars-length'>
                  {postContentLength} / {MAX_CONTENT_CHARS}
                </span>
              </div>
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
                <Button className='danger' onClickHandler={handlePostDelete}>
                  Delete
                </Button>
              )}
              {isEditable && (
                <>
                  <Button className='success' onClickHandler={handleUpdatePost}>
                    Save Changes
                  </Button>
                  <Button
                    className='danger'
                    onClickHandler={() => {
                      setIsEditable(false);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
            <div className='public__controls'>
              <div className='vote-controls'>
                <div
                  className='option__vote-controls'
                  onClick={() => handleLikesDislikesClick('likes')}
                >
                  <i className='fa-solid fa-thumbs-up'></i>
                  <span>{postLikes}</span>
                </div>
                <div
                  className='option__vote-controls'
                  onClick={() => handleLikesDislikesClick('dislikes')}
                >
                  <i className='fa-solid fa-thumbs-down'></i>
                  <span>{postDislikes}</span>
                </div>
              </div>
              <div className='reply-button'>
                <Button
                  onClickHandler={() => setShowCommentForm((prev) => !prev)}
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </article>

        <div className='comments-section__single-post'>
          <h3>{postComments.length} Comments</h3>
          <div className='comments-list'>
            {postComments.map((comment) => {
              if (authUser.uid === comment.authorId || dbUser?.isAdmin) {
                return (
                  <SingleListCommentItem
                    key={comment.commentId}
                    commentObject={comment}
                    onDelete={() => handleDeleteComment(comment.commentId)}
                  />
                );
              } else {
                return (
                  <SingleListCommentItem
                    key={comment.commentId}
                    commentObject={comment}
                  />
                );
              }
            })}
          </div>
        </div>

        {showCommentForm && (
          <CommentForm
            postTitle={postObject.title}
            saveHandler={handleAddNewComment}
            cancelHandler={() => setShowCommentForm(false)}
            commentFormValue={commentContentValue}
            commentFormOnChangeHandler={setCommentContentValue}
          />
        )}
      </>
    )
  );
}

PostSingleView.propTypes = {
  id: PropTypes.string,
};

export default PostSingleView;
