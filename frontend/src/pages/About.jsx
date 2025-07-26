import { Link } from 'react-router-dom';

const About = () => {
  const styles = {
    container: {
      padding: '24px',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '24px',
      color: '#111827',
      textAlign: 'center',
      borderBottom: '3px solid #3b82f6',
      paddingBottom: '16px'
    },
    section: {
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#1f2937',
      borderLeft: '4px solid #3b82f6',
      paddingLeft: '12px'
    },
    paragraph: {
      marginBottom: '16px',
      color: '#374151',
      fontSize: '16px',
      textAlign: 'justify'
    },
    featureList: {
      listStyle: 'none',
      padding: '0'
    },
    featureItem: {
      backgroundColor: '#f9fafb',
      padding: '12px 16px',
      marginBottom: '8px',
      borderRadius: '8px',
      borderLeft: '4px solid #10b981',
      fontSize: '15px',
      color: '#374151'
    },
    techStack: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginTop: '16px'
    },
    techCategory: {
      backgroundColor: '#f3f4f6',
      padding: '16px',
      borderRadius: '8px',
      textAlign: 'center'
    },
    techTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '8px'
    },
    techItem: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '4px'
    },
    link: {
      color: '#3b82f6',
      textDecoration: 'underline',
      fontWeight: '500'
    },
    highlight: {
      backgroundColor: '#dbeafe',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #93c5fd',
      marginTop: '16px'
    },
    highlightText: {
      color: '#1e40af',
      fontSize: '15px',
      fontWeight: '500',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>About BlogApp</h1>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Project Overview</h2>
        <p style={styles.paragraph}>
          BlogApp is a modern, full-stack blogging platform built with cutting-edge web technologies. 
          It provides a comprehensive solution for content creators, readers, and administrators to 
          interact with blog content in a seamless and intuitive way. The platform emphasizes user 
          experience, security, and scalability.
        </p>
        <p style={styles.paragraph}>
          Whether you're an individual blogger looking to share your thoughts with the world, or an 
          organization managing multiple content creators, BlogApp offers the tools and features 
          necessary to create, manage, and distribute engaging blog content effectively.
        </p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Key Features</h2>
        <ul style={styles.featureList}>
          <li style={styles.featureItem}>
            <strong>User Authentication & Authorization:</strong> Secure registration, login, and role-based access control
          </li>
          <li style={styles.featureItem}>
            <strong>Blog Management:</strong> Create, edit, delete, and view blog posts with rich content support
          </li>
          <li style={styles.featureItem}>
            <strong>User Profiles:</strong> Personalized user profiles with customizable settings
          </li>
          <li style={styles.featureItem}>
            <strong>Admin Dashboard:</strong> Comprehensive administrative panel for user and content management
          </li>
          <li style={styles.featureItem}>
            <strong>Image Support:</strong> Upload and manage images for blog posts
          </li>
          <li style={styles.featureItem}>
            <strong>Password Recovery:</strong> Secure password reset functionality with date of birth verification
          </li>
          <li style={styles.featureItem}>
            <strong>Responsive Design:</strong> Optimized for desktop, tablet, and mobile devices
          </li>
          <li style={styles.featureItem}>
            <strong>Real-time Updates:</strong> Dynamic content loading and user state management
          </li>
        </ul>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Technology Stack</h2>
        <p style={styles.paragraph}>
          BlogApp is built using modern web development technologies to ensure performance, 
          maintainability, and scalability:
        </p>
        <div style={styles.techStack}>
          <div style={styles.techCategory}>
            <h3 style={styles.techTitle}>Frontend</h3>
            <div style={styles.techItem}>React.js</div>
            <div style={styles.techItem}>React Router</div>
            <div style={styles.techItem}>Modern JavaScript (ES6+)</div>
            <div style={styles.techItem}>CSS3 & Responsive Design</div>
          </div>
          <div style={styles.techCategory}>
            <h3 style={styles.techTitle}>Backend</h3>
            <div style={styles.techItem}>Node.js</div>
            <div style={styles.techItem}>Express.js</div>
            <div style={styles.techItem}>RESTful API Architecture</div>
            <div style={styles.techItem}>JWT Authentication</div>
          </div>
          <div style={styles.techCategory}>
            <h3 style={styles.techTitle}>Database</h3>
            <div style={styles.techItem}>MongoDB</div>
            <div style={styles.techItem}>Mongoose ODM</div>
            <div style={styles.techItem}>Data Validation</div>
            <div style={styles.techItem}>Indexing & Optimization</div>
          </div>
          <div style={styles.techCategory}>
            <h3 style={styles.techTitle}>Development</h3>
            <div style={styles.techItem}>Vite Build Tool</div>
            <div style={styles.techItem}>ESLint Code Quality</div>
            <div style={styles.techItem}>Git Version Control</div>
            <div style={styles.techItem}>Environment Configuration</div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>User Roles & Permissions</h2>
        <p style={styles.paragraph}>
          BlogApp implements a role-based access control system to ensure appropriate permissions 
          for different types of users:
        </p>
        <ul style={styles.featureList}>
          <li style={styles.featureItem}>
            <strong>Regular Users:</strong> Can create, edit, and delete their own blog posts, manage their profile, and view all published content
          </li>
          <li style={styles.featureItem}>
            <strong>Administrators:</strong> Have full access to user management, content moderation, and system administration features
          </li>
          <li style={styles.featureItem}>
            <strong>Guest Users:</strong> Can view published blog content and access registration/login functionality
          </li>
        </ul>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Security Features</h2>
        <p style={styles.paragraph}>
          Security is a top priority in BlogApp. The platform implements multiple layers of 
          protection to ensure user data safety and system integrity:
        </p>
        <ul style={styles.featureList}>
          <li style={styles.featureItem}>
            <strong>JWT Token Authentication:</strong> Secure, stateless authentication mechanism
          </li>
          <li style={styles.featureItem}>
            <strong>Password Hashing:</strong> Bcrypt encryption for secure password storage
          </li>
          <li style={styles.featureItem}>
            <strong>Input Validation:</strong> Comprehensive data validation on both client and server sides
          </li>
          <li style={styles.featureItem}>
            <strong>Protected Routes:</strong> Route-level authentication and authorization
          </li>
          <li style={styles.featureItem}>
            <strong>CORS Configuration:</strong> Proper cross-origin resource sharing setup
          </li>
        </ul>
      </div>

      <div style={styles.highlight}>
        <p style={styles.highlightText}>
          Ready to start your blogging journey? <Link to="/register" style={styles.link}>Create an account</Link> or <Link to="/login" style={styles.link}>sign in</Link> to get started!
        </p>
      </div>
    </div>
  );
};

export default About;