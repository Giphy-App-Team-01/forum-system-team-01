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
  subscribeToPost,
} from '../../api/db-service';
import SingleListCommentItem from '../../components/SingleListCommentItem/SingleListCommentItem';
import { MIN_CONTENT_CHARS, MAX_CONTENT_CHARS } from '../../common/constants';
import CommentForm from '../../components/CommentForm/CommentForm';
import { validatePostContent } from '../../utils/validationHelpers';
import Button from '../../components/Button/Button';
import { formatTimestamp } from '../../utils/utils';
import { useEffect, useState, useContext, useRef } from 'react';
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
  const [usersVoted, setUsersVoted] = useState({});
  const postContentRef = useRef(null); // Референция към textarea
  const { id } = useParams();
  const { authUser, dbUser } = useContext(AppContext);

  const handleEditClick = () => {
    setIsEditable(true);
  };
  const handleUsernameClick = () => {
    navigate(`/user/${postObject.authorId}`);
  };

  const handleLikesDislikesClick = (type) => {
    if (!authUser) return;
  
    const userVote = usersVoted[authUser.uid]; // Takes the user's vote
  
    let updatedLikes = postLikes;
    let updatedDislikes = postDislikes;
    let updatedUsersVoted = { ...usersVoted };
  
    if (userVote === type) {
      // If we click on the same vote type, we remove the vote
      if (type === "likes") {
        updatedLikes -= 1;
      } else if (type === "dislikes") {
        updatedDislikes -= 1;
      }
  
      delete updatedUsersVoted[authUser.uid]; // Remove the user's vote
    } else {
      // If we click on a different vote type, we update the vote
      if (userVote === "likes") {
        updatedLikes -= 1;
      } else if (userVote === "dislikes") {
        updatedDislikes -= 1;
      }
  
      if (type === "likes") {
        updatedLikes += 1;
      } else {
        updatedDislikes += 1;
      }
  
      updatedUsersVoted[authUser.uid] = type; //Save the user's vote
    }
  
    setPostLikes(updatedLikes);
    setPostDislikes(updatedDislikes);
    setUsersVoted(updatedUsersVoted);
    updateLikesDislikes(id, updatedLikes, updatedDislikes, authUser.uid, updatedUsersVoted[authUser.uid] || null);
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
  
    const handlePostUpdate = async (postData) => {
      const postAuthorImage = await getUserProfilePicture(postData.authorId);
      const currentUserName = await getUserData(postData.authorId);
  
      setPostObject(postData);
      setPostLikes(postData.likes || 0);
      setPostDislikes(postData.dislikes || 0);
      setUsersVoted(postData.usersVoted || {});
      setUserProfilePicture(postAuthorImage);
      setCurrentUsername(currentUserName);
      setPostContentValue(postData.content);
      setPostContentLength(postData.content.length);
    };
  
    const unsubscribePost = subscribeToPost(id, handlePostUpdate);
    const unsubscribeComments = subscribeToComments(id, (comments) => {
      setPostComments(comments);
    });
  
    return () => {
      unsubscribePost();
      unsubscribeComments();
    };
  }, [id]);

  useEffect(() => {
    updateCommentCount(id, postComments.length);
  }, [postComments]);

  //Auto resize textarea height based on content length 
  useEffect(() => {
    if (postContentRef.current) {
      postContentRef.current.style.height = "auto"; 
      postContentRef.current.style.height = postContentRef.current.scrollHeight + "px"; 
    }
  }, [postContentValue,isEditable]);


  console.log(postComments);

  return (
    postObject && (
      <>
      <div className="single-post-view-container">
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
                ref={postContentRef}
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
                ref={postContentRef}
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
            <div className="vote-controls">
                <div
                  className={`option__vote-controls ${
                    usersVoted[authUser?.uid] === 'likes' ? 'voted' : ''
                  }`}
                  onClick={() => handleLikesDislikesClick('likes')}
                >
                  <i className="fa-solid fa-thumbs-up"></i>
                  <span>{postLikes}</span>
                </div>

                <div
                  className={`option__vote-controls ${
                    usersVoted[authUser?.uid] === 'dislikes' ? 'voted' : ''
                  }`}
                  onClick={() => handleLikesDislikesClick('dislikes')}
                >
                  <i className="fa-solid fa-thumbs-down"></i>
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
        </div>
      </>
    )
  );
}

PostSingleView.propTypes = {
  id: PropTypes.string,
};

export default PostSingleView;
