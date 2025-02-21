import './CommentForm.css';
import Button from '../Button/Button';
import PropTypes from 'prop-types';
function CommentForm({
  postTitle,
  commentFormValue,
  commentFormOnChangeHandler,
  saveHandler,
  cancelHandler,
}) {
  return (
    <div className='comment-form'>
      <h4 className='reply-to-post__comment-form'>
        Reply with a comment for <span>{postTitle}</span>
      </h4>
      <div className='comment-content-textarea'>
        <textarea
          name='comment'
          id='comment-form-textarea'
          placeholder='Enter your comment here...'
          value={commentFormValue}
          onChange={(e) => commentFormOnChangeHandler(e.target.value)}
        ></textarea>
      </div>

      <div className='actions__comment-form'>
        <Button className='success' onClickHandler={saveHandler}>
          Save
        </Button>
        <Button className='danger' onClickHandler={cancelHandler}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

CommentForm.propTypes = {
  postTitle: PropTypes.string,
  saveHandler: PropTypes.func,
  cancelHandler: PropTypes.func,
  commentFormValue: PropTypes.string,
  commentFormOnChangeHandler: PropTypes.func,
};

export default CommentForm;
