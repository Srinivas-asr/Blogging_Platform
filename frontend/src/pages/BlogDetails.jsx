import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import { getImageSizeClass } from '../utils/imageSizes';
import { getBlogById } from '../api/api';

const BlogDetails = ({ user }) => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  // Internal styles
  const styles = {
    container: {
      padding: '32px 24px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
      marginTop: '80px', // Account for fixed navbar
      minHeight: 'calc(100vh - 80px)',
      lineHeight: '1.6',
      transition: 'all 0.3s ease',
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: '700',
      marginBottom: '20px',
      color: '#1e293b',
      lineHeight: '1.3',
      letterSpacing: '-0.025em',
    },
    meta: {
      color: '#6b7280',
      marginBottom: '16px',
      fontSize: '0.9rem',
      fontWeight: '500',
      fontStyle: 'italic',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    image: {
      width: '100%',
      maxHeight: '400px',
      objectFit: 'cover',
      borderRadius: '8px',
      margin: '24px 0',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
    },
    imageHover: {
      transform: 'scale(1.02)',
    },
    content: {
      marginBottom: '24px',
      fontSize: '1rem',
      lineHeight: '1.75',
      color: '#374151',
      fontFamily: '"Inter", sans-serif',
    },
    contentParagraph: {
      marginBottom: '16px',
    },
    contentHeading: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1e293b',
      margin: '24px 0 16px',
    },
    contentList: {
      marginBottom: '16px',
      paddingLeft: '24px',
    },
    contentListItem: {
      marginBottom: '8px',
    },
    categories: {
      color: '#10b981',
      backgroundColor: '#ecfdf5',
      padding: '8px 16px',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: '500',
      marginBottom: '24px',
      display: 'inline-block',
    },
    backLink: {
      color: '#1d4ed8',
      fontSize: '0.9rem',
      fontWeight: '500',
      marginTop: '24px',
      display: 'inline-flex',
      alignItems: 'center',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
    },
    backLinkHover: {
      backgroundColor: '#eff6ff',
      color: '#1e40af',
      transform: 'scale(1.05)',
    },
    errorMessage: {
      padding: '16px',
      color: '#ef4444',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      textAlign: 'center',
      fontSize: '0.9rem',
      margin: '24px auto',
      maxWidth: '600px',
    },
    loadingMessage: {
      padding: '16px',
      color: '#6b7280',
      textAlign: 'center',
      fontSize: '1rem',
      margin: '24px auto',
    },
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log('Fetching blog with id:', id);
        const { data } = await getBlogById(id);
        console.log('Blog data received:', data);
        setBlog(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.response?.data?.message || 'Failed to load blog');
      }
    };
    fetchBlog();
  }, [id]);

  if (error) return <div style={styles.errorMessage}>{error}</div>;
  if (!blog) return <div style={styles.loadingMessage}>Loading blog...</div>;

  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown date';

  return (
    <div style={styles.container}>
      <Link
        to="/"
        style={styles.backLink}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, styles.backLinkHover);
        }}
        onMouseLeave={(e) => {
          e.target.style.color = styles.backLink.color;
          e.target.style.backgroundColor = 'transparent';
          e.target.style.transform = 'scale(1)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Blog List
      </Link>
    
      <h1 style={styles.title}>{blog.title}</h1>
      <p style={styles.meta}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        By {blog.author?.name || 'Unknown'} on {formattedDate}
      </p>
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          style={{
            ...styles.image,
            ...getImageSizeClass(blog.imageSize, false, true),
          }}
          onError={(e) => (e.target.style.display = 'none')}
          onMouseEnter={(e) => {
            e.target.style.transform = styles.imageHover.transform;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        />
      )}
      <div
        style={styles.content}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <p style={styles.categories}>Categories: {blog.categories?.join(', ') || 'None'}</p>
      <CommentSection blog={blog} user={user} setBlog={setBlog} />
      </div>
  );
};

export default BlogDetails;