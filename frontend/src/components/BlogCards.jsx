import { Link } from 'react-router-dom';
import { verifyPassword } from '../api/api';

const BlogCards = ({ blog, onDelete, user, showFullDetails }) => {
  const isAuthor = user && blog.author?._id && user.id === blog.author._id.toString();

  // Internal styles
  const styles = {
    container: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: showFullDetails ? '16px' : '12px',
      margin: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: showFullDetails ? '12px' : '8px',
      transition: 'box-shadow 0.3s ease, transform 0.2s ease',
      cursor: 'pointer',
    },
    containerHover: {
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transform: 'scale(1.02)',
    },
    image: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '4px',
      border: '1px solid #d1d5db',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      marginBottom: '8px',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      margin: '0',
      color: '#111827',
      textAlign: 'center',
    },
    content: {
      fontSize: '14px',
      color: '#4b5563',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      margin: '0',
    },
    authorText: {
      fontSize: '14px',
      color: '#374151',
      fontStyle: 'italic',
      margin: '0',
    },
    categoriesContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '8px',
    },
    categoryTag: {
      fontSize: '12px',
      color: '#10b981',
      backgroundColor: '#ecfdf5',
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      padding: '2px 8px',
    },
    actionsContainer: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
    },
    editLink: {
      padding: '8px 16px',
      borderRadius: '4px',
      backgroundColor: '#10b981',
      color: '#ffffff',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, transform 0.2s ease',
    },
    editLinkHover: {
      backgroundColor: '#059669',
      transform: 'scale(1.05)',
    },
    deleteButton: {
      padding: '8px 16px',
      borderRadius: '4px',
      backgroundColor: '#dc2626',
      color: '#ffffff',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, transform 0.2s ease',
    },
    deleteButtonHover: {
      backgroundColor: '#b91c1c',
      transform: 'scale(1.05)',
    },
    errorContainer: {
      padding: '16px',
      color: '#ef4444',
      backgroundColor: '#fef2f2',
      borderRadius: '8px',
      border: '1px solid #fecaca',
    },
  };

  const handleDeleteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Delete button clicked for blog:', blog._id);

    // Show warning alert
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the blog "${blog.title}"? This action cannot be undone.`
    );
    if (!confirmDelete) {
      console.log('Deletion cancelled by user');
      return;
    }

    // Prompt for password
    const password = window.prompt('Please enter your password to confirm deletion:');
    if (!password) {
      console.log('No password entered, deletion cancelled');
      alert('Password is required to delete the blog.');
      return;
    }

    try {
      // Verify password
      console.log('Verifying password for user:', user.id);
      await verifyPassword(user.id, { password });
      console.log('Password verified successfully');

      // Proceed with deletion
      console.log('Deleting blog:', blog._id);
      await onDelete(blog._id);
      console.log('Blog deleted successfully');
      alert('Blog deleted successfully!');
    } catch (err) {
      console.error('Error during deletion:', err);
      let errorMessage = 'Failed to delete blog. Please try again.';
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data.message || 'Incorrect password.';
        } else if (err.response.status === 404) {
          errorMessage = 'Blog or user not found.';
        } else if (err.response.status === 401) {
          errorMessage = 'Unauthorized: Please log in again.';
        } else if (err.response.status === 403) {
          errorMessage = 'You are not authorized to delete this blog.';
        }
      }
      alert(errorMessage);
    }
  };

  if (!blog || !blog._id) {
    console.error('Invalid blog data:', blog);
    return <div style={styles.errorContainer}>Error: Invalid blog data</div>;
  }

  return (
    <Link
      to={`/blog/${blog._id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      onClick={() => console.log('Navigating to view:', blog._id)}
    >
      <div
        style={styles.container}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, styles.containerHover);
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = styles.container.boxShadow;
          e.target.style.transform = 'scale(1)';
        }}
      >
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            style={styles.image}
            onError={(e) => (e.target.style.display = 'none')}
          />
        )}
        <h2 style={styles.title}>{blog.title}</h2>
        {showFullDetails && (
          <>
            <p style={styles.content}>{blog.content}</p>
            <p style={styles.authorText}>By {blog.author?.name || 'Unknown'}</p>
            <div style={styles.categoriesContainer}>
              {blog.categories?.length ? (
                blog.categories.map((category, index) => (
                  <span key={index} style={styles.categoryTag}>
                    {category}
                  </span>
                ))
              ) : (
                <span style={styles.categoryTag}>Uncategorized</span>
              )}
            </div>
            {isAuthor && (
              <div
                style={styles.actionsContainer}
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  to={`/edit/${blog._id}`}
                  style={styles.editLink}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Navigating to edit:', blog._id);
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = styles.editLinkHover.backgroundColor;
                    e.target.style.transform = styles.editLinkHover.transform;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = styles.editLink.backgroundColor;
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={handleDeleteClick}
                  style={styles.deleteButton}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor;
                    e.target.style.transform = styles.deleteButtonHover.transform;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = styles.deleteButton.backgroundColor;
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Link>
  );
};

export default BlogCards;