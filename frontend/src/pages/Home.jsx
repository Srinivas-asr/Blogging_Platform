import { Link, useNavigate } from 'react-router-dom';

const Home = ({ user }) => {
  const navigate = useNavigate();

  // Debug user prop
  console.log('Home.jsx: user prop:', user);

  // Internal styles
  const styles = {
    container: {
      padding: '32px 24px',
      maxWidth: '800px',
      margin: '80px auto 32px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
      minHeight: 'calc(100vh - 80px)',
      lineHeight: '1.6',
      transition: 'all 0.3s ease',
      display: 'flex', // Enable flex for bottom positioning
      flexDirection: 'column',
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: '700',
      marginBottom: '24px',
      color: '#1e293b',
      lineHeight: '1.3',
      letterSpacing: '-0.025em',
    },
    greeting: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    paragraph: {
      marginBottom: '20px',
      color: '#374151',
      fontSize: '1rem',
      fontFamily: '"Inter", sans-serif',
      lineHeight: '1.75',
    },
    link: {
      color: '#1d4ed8',
      textDecoration: 'underline',
      fontWeight: '500',
      transition: 'color 0.2s ease',
    },
    linkHover: {
      color: '#1e40af',
    },
    button: {
      backgroundColor: '#1d4ed8',
      color: '#ffffff',
      padding: '12px 24px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s ease, transform 0.2s ease',
      textDecoration: 'none',
    },
    buttonHover: {
      backgroundColor: '#1e40af',
      transform: 'scale(1.05)',
    },
    smallButton: {
      backgroundColor: '#1d4ed8',
      color: '#ffffff',
      padding: '8px 16px', // Smaller size
      borderRadius: '6px',
      border: 'none',
      fontSize: '0.8rem', // Smaller font
      fontWeight: '600',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s ease, transform 0.2s ease',
      textDecoration: 'none',
      position: 'relative',
      zIndex: 10,
      marginTop: 'auto', // Push to bottom
      alignSelf: 'center', // Center horizontally
    },
    smallButtonHover: {
      backgroundColor: '#1e40af',
      transform: 'scale(1.05)',
    },
  };

  const handleSmallDashboardClick = () => {
    console.log('Home.jsx: Small Dashboard button clicked, user role:', user?.role);
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={styles.container}>
      {user && (
        <div style={styles.greeting}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          Hi, {user.name || 'User'}
        </div>
      )}
      <h1 style={styles.title}>Welcome to BlogApp</h1>
      <p style={styles.paragraph}>
        BlogApp is a simple yet powerful blogging platform designed to help users create, share, and manage their blog posts effortlessly. Whether you're an individual looking to express your thoughts or an admin managing content, BlogApp provides a seamless experience with features like user authentication, blog creation, editing, and profile management.
      </p>
      <p style={styles.paragraph}>
        Key features include:
      </p>
      <ul style={{ ...styles.paragraph, paddingLeft: '24px', marginBottom: '20px' }}>
        <li style={{ marginBottom: '8px' }}>User registration and login with profile settings.</li>
        <li style={{ marginBottom: '8px' }}>Create and edit blogs with image support.</li>
        <li style={{ marginBottom: '8px' }}>Admin dashboard for managing users.</li>
        <li style={{ marginBottom: '8px' }}>Forgot password functionality with date of birth verification.</li>
      </ul>
      <p style={styles.paragraph}>
        To get started, please{' '}
        <Link
          to="/login"
          style={styles.link}
          onMouseEnter={(e) => (e.target.style.color = styles.linkHover.color)}
          onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
        >
          log in
        </Link>{' '}
        or{' '}
        <Link
          to="/register"
          style={styles.link}
          onMouseEnter={(e) => (e.target.style.color = styles.linkHover.color)}
          onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
        >
          register
        </Link>{' '}
        if you don’t have an account.
      </p>
      
      {user && (
        <>
          {console.log('Home.jsx: Rendering small Dashboard button')}
          <button
            data-testid="small-dashboard-button"
            onClick={handleSmallDashboardClick}
            style={styles.smallButton}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.smallButtonHover)}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.smallButton.backgroundColor;
              e.target.style.transform = 'scale(1)';
            }}
          >
            Go to Dashboard
          </button>
        </>
      )}
    </div>
  );
};

export default Home;