import { useState } from 'react';
import { addComment, toggleLike } from '../api/api';

const CommentSection = ({ blog, user, setBlog }) => {
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);

  // Internal styles
  const styles = {
    container: {
      marginTop: '24px'
    },
    likeContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px'
    },
    likeButton: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s ease'
    },
    likeButtonLiked: {
      backgroundColor: '#ef4444'
    },
    likeButtonNotLiked: {
      backgroundColor: '#9ca3af'
    },
    commentsTitle: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#111827'
    },
    noComments: {
      color: '#6b7280',
      fontStyle: 'italic'
    },
    commentItem: {
      borderBottom: '1px solid #e5e7eb',
      paddingTop: '8px',
      paddingBottom: '8px'
    },
    commentMeta: {
      color: '#6b7280',
      fontSize: '0.875rem',
      marginBottom: '4px'
    },
    commentContent: {
      color: '#111827',
      lineHeight: '1.5'
    },
    commentForm: {
      marginTop: '16px'
    },
    textarea: {
      width: '100%',
      padding: '8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      marginBottom: '8px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '80px',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    },
    textareaFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    submitButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s ease'
    },
    submitButtonHover: {
      backgroundColor: '#2563eb'
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to comment");
      return;
    }
    try {
      const { data } = await addComment(blog._id, { user: user.id, content: comment });
      setBlog(data);
      setComment("");
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleToggleLike = async () => {
    if (!user) {
      alert("Please log in to like");
      return;
    }
    try {
      const { data } = await toggleLike(blog._id, !liked);
      setBlog(data);
      setLiked(!liked);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle like');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.likeContainer}>
        <button
          onClick={handleToggleLike}
          style={{
            ...styles.likeButton,
            ...(liked ? styles.likeButtonLiked : styles.likeButtonNotLiked)
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '1';
          }}
        >
          {liked ? 'Unlike' : 'Like'} ({blog.likes})
        </button>
      </div>
      <h3 style={styles.commentsTitle}>Comments</h3>
      {blog.comments.length === 0 ? (
        <p style={styles.noComments}>No comments yet.</p>
      ) : (
        blog.comments.map((c, index) => (
          <div key={index} style={styles.commentItem}>
            <p style={styles.commentMeta}>
              By {c.user.name} on {new Date(c.createdAt).toLocaleString()}
            </p>
            <p style={styles.commentContent}>{c.content}</p>
          </div>
        ))
      )}
      {user && (
        <form onSubmit={handleAddComment} style={styles.commentForm}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            style={styles.textarea}
            onFocus={(e) => {
              Object.assign(e.target.style, styles.textareaFocus);
            }}
            onBlur={(e) => {
              e.target.style.borderColor = styles.textarea.borderColor;
              e.target.style.boxShadow = 'none';
            }}
            required
          />
          <button 
            type="submit" 
            style={styles.submitButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.submitButton.backgroundColor;
            }}
          >
            Comment
          </button>
        </form>
      )}
    </div>
  );
};

export default CommentSection;