import './CommentForm.css';
import Button from '../Button/Button';
import PropTypes from 'prop-types';
function CommentForm({ postTitle }) {
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
        ></textarea>
      </div>

      <div className='actions__comment-form'>
        <Button className='success'>Save</Button>
        <Button className='danger'>Cancel</Button>
      </div>
    </div>
  );
}

CommentForm.propTypes = {
  postTitle: PropTypes.string,
};

export default CommentForm;
