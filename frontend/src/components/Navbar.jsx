import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsProfileOpen(false); // Close dropdown on logout
    navigate('/home');
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    setIsProfileOpen(false);
  }, [navigate]);

  // Internal styles
  const styles = {
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: '16px 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    },
    link: {
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#374151',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    linkHover: {
      color: '#1d4ed8',
    },
    button: {
      backgroundColor: '#1d4ed8',
      color: '#ffffff',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '0.9rem',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'background-color 0.2s ease, transform 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    buttonHover: {
      backgroundColor: '#1e40af',
      transform: 'scale(1.02)',
    },
    profileIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#1d4ed8',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      fontWeight: '600',
      fontFamily: '"Inter", sans-serif',
      textTransform: 'uppercase',
      textDecoration: 'none',
      transition: 'background-color 0.2s ease, transform 0.2s ease',
      cursor: 'pointer',
    },
    profileIconHover: {
      backgroundColor: '#1e40af',
      transform: 'scale(1.05)',
    },
    profileDropdown: {
      position: 'absolute',
      top: '64px',
      right: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
      padding: '16px',
      width: '240px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      fontFamily: '"Inter", sans-serif',
    },
    profileInfo: {
      fontSize: '0.9rem',
      color: '#374151',
      lineHeight: '1.5',
    },
    profileLabel: {
      fontWeight: '600',
      color: '#1e293b',
      marginRight: '4px',
    },
    logoutButton: {
      backgroundColor: '#dc2626',
      color: '#ffffff',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, transform 0.2s ease',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    logoutButtonHover: {
      backgroundColor: '#b91c1c',
      transform: 'scale(1.02)',
    },
    icon: {
      width: '18px',
      height: '18px',
      stroke: 'currentColor',
      strokeWidth: '2',
      fill: 'none',
    },
  };

  return (
    <nav style={styles.nav}>
      <Link to="/home" style={styles.logo}>
        <svg style={styles.icon} viewBox="0 0 24 24">
          <path d="M12 2L2 7h2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7h2L12 2z" />
        </svg>
        BlogApp
      </Link>
      <div style={styles.navLinks}>
        <Link
          to="/home"
          style={styles.link}
          onMouseEnter={(e) => (e.target.style.color = styles.linkHover.color)}
          onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
        >
          <svg style={styles.icon} viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
            <path d="M9 22V12h6v10" />
          </svg>
          Home
        </Link>
        <Link
          to="/about"
          style={styles.link}
          onMouseEnter={(e) => (e.target.style.color = styles.linkHover.color)}
          onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
        >
          <svg style={styles.icon} viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          About
        </Link>
        {user ? (
          <>
            <Link
              to={user.role === 'admin' ? '/admin' : '/'}
              style={styles.button}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.button.backgroundColor;
                e.target.style.transform = 'scale(1)';
              }}
            >
              <svg style={styles.icon} viewBox="0 0 24 24">
                <path d="M3 3v18h18M7 14v4M11 10v8M15 7v11M19 12v6" />
              </svg>
              Dashboard
            </Link>
            <Link
              to="/create"
              style={styles.link}
              onMouseEnter={(e) => (e.target.style.color = styles.linkHover.color)}
              onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
            >
              <svg style={styles.icon} viewBox="0 0 24 24">
                <path d="M12 5v14m-7-7h14" />
              </svg>
              Create Blog
            </Link>
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <div
                style={styles.profileIcon}
                onClick={toggleProfileDropdown}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.profileIconHover)}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = styles.profileIcon.backgroundColor;
                  e.target.style.transform = 'scale(1)';
                }}
                title={`Profile (${user.name || 'User'})`}
              >
                <svg style={styles.icon} viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              {isProfileOpen && (
                <div style={styles.profileDropdown}>
                  <p style={styles.profileInfo}>
                    <span style={styles.profileLabel}>Name:</span> {user.name || 'N/A'}
                  </p>
                  <p style={styles.profileInfo}>
                    <span style={styles.profileLabel}>Email:</span> {user.email || 'N/A'}
                  </p>
                  <p style={styles.profileInfo}>
                    <span style={styles.profileLabel}>Role:</span> {user.role || 'User'}
                  </p>
                  <button
                    onClick={handleLogout}
                    style={styles.logoutButton}
                    onMouseEnter={(e) => Object.assign(e.target.style, styles.logoutButtonHover)}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = styles.logoutButton.backgroundColor;
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <svg style={styles.icon} viewBox="0 0 24 24">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={styles.link}
              onMouseEnter={(e) => (e.target.style.color = styles.linkHover.color)}
              onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
            >
              <svg style={styles.icon} viewBox="0 0 24 24">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              Login
            </Link>
            <Link
              to="/register"
              style={styles.link}
              onMouseEnter={(e) => (e.target.style.color = styles.linkHover.color)}
              onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
            >
              <svg style={styles.icon} viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                <path d="M12 16v6" />
              </svg>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;