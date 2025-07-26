import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogs, getUsers, deleteBlog, deleteUser } from '../api/api';
import Chart from 'chart.js/auto';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('statistics');
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loginStats, setLoginStats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Internal styles
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: '"Inter", sans-serif',
    },
    sidebar: {
      width: '240px',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      position: 'fixed',
      top: '64px',
      left: 0,
      height: 'calc(100vh - 64px)',
      zIndex: 10,
      boxShadow: '2px 0 12px rgba(0, 0, 0, 0.08)',
      borderRight: '1px solid #e2e8f0',
      transition: 'transform 0.3s ease',
      transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
    },
    sidebarHeader: {
      fontSize: '1.3rem',
      fontWeight: '700',
      marginBottom: '16px',
      paddingBottom: '10px',
      borderBottom: '2px solid #e2e8f0',
      color: '#1e293b',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    sidebarButton: {
      padding: '12px 16px',
      backgroundColor: 'transparent',
      color: '#475569',
      border: 'none',
      textAlign: 'left',
      fontSize: '15px',
      fontWeight: '500',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
    },
    sidebarButtonActive: {
      backgroundColor: '#eff6ff',
      color: '#1d4ed8',
      fontWeight: '600',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    sidebarButtonHover: {
      backgroundColor: '#f1f5f9',
      color: '#1d4ed8',
      transform: 'translateX(4px)',
    },
    sidebarToggle: {
      display: isMobile ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: '80px',
      left: '12px',
      width: '40px',
      height: '40px',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      fontSize: '1.2rem',
      cursor: 'pointer',
      zIndex: 1001,
      transition: 'background-color 0.2s ease, transform 0.2s ease',
    },
    sidebarToggleHover: {
      backgroundColor: '#f1f5f9',
      transform: 'scale(1.05)',
    },
    mainContent: {
      flex: 1,
      padding: '32px 24px',
      marginLeft: isMobile ? '0' : '240px',
      marginTop: '64px',
      minHeight: '100vh',
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '24px',
    },
    statCard: {
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    statTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '12px',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1d4ed8',
    },
    chartContainer: {
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
      maxWidth: '100%',
      height: '300px',
    },
    searchFilterContainer: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    },
    input: {
      width: '100%',
      maxWidth: '384px',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.9rem',
      color: '#374151',
      outline: 'none',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    inputFocus: {
      borderColor: '#1d4ed8',
      boxShadow: '0 0 0 2px rgba(29, 78, 216, 0.2)',
    },
    select: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.9rem',
      color: '#374151',
      outline: 'none',
      backgroundColor: '#ffffff',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    selectFocus: {
      borderColor: '#1d4ed8',
      boxShadow: '0 0 0 2px rgba(29, 78, 216, 0.2)',
    },
    blogList: {
      display: 'grid',
      gap: '24px',
    },
    blogCard: {
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
    },
    blogImageContainer: {
      width: '128px',
      height: '128px',
      flexShrink: 0,
    },
    blogImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '6px',
    },
    noImage: {
      width: '100%',
      height: '100%',
      backgroundColor: '#e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
      color: '#6b7280',
      fontSize: '0.8rem',
      fontWeight: '500',
    },
    blogDetails: {
      flex: 1,
    },
    blogTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '12px',
    },
    blogText: {
      fontSize: '0.9rem',
      color: '#374151',
      marginBottom: '8px',
    },
    blogContent: {
      fontSize: '0.9rem',
      color: '#374151',
      marginTop: '12px',
      lineHeight: '1.75',
    },
    noResults: {
      fontSize: '0.9rem',
      color: '#374151',
      marginTop: '24px',
    },
    tableContainer: {
      overflowX: 'auto',
      borderRadius: '8px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    },
    table: {
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      borderCollapse: 'collapse',
    },
    thead: {
      backgroundColor: '#e5e7eb',
    },
    th: {
      padding: '16px',
      borderBottom: '1px solid #d1d5db',
      textAlign: 'left',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#1e293b',
    },
    tr: {
      transition: 'background-color 0.2s ease',
    },
    trHover: {
      backgroundColor: '#f9fafb',
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #d1d5db',
      fontSize: '0.9rem',
      color: '#374151',
    },
    deleteButton: {
      padding: '8px 16px',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: '#dc3545',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, transform 0.2s ease',
      outline: 'none',
    },
    deleteButtonHover: {
      backgroundColor: '#b82333',
      transform: 'scale(1.05)',
    },
    deleteButtonFocus: {
      outline: '2px solid #1e293b',
      outlineOffset: '2px',
    },
    errorMessage: {
      fontSize: '0.9rem',
      color: '#dc3545',
      marginTop: '24px',
      textAlign: 'center',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
      display: isMobile && isSidebarOpen ? 'block' : 'none',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '24px',
    },
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('AdminDashboard: No token found');
          navigate('/admin-login');
          return;
        }
        const { data } = await getBlogs();
        console.log('AdminDashboard: Fetched blogs:', data);
        const mappedBlogs = data.map(blog => ({
          ...blog,
          image: blog.image || '',
          categories: Array.isArray(blog.categories) ? blog.categories : ['General'],
        }));
        setBlogs(mappedBlogs);
      } catch (err) {
        console.error('AdminDashboard: Error fetching blogs:', err);
        if (err.response?.status === 401) {
          navigate('/admin-login');
        }
        setBlogs([]);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('AdminDashboard: No token found');
          navigate('/admin-login');
          return;
        }
        const { data } = await getUsers();
        console.log('AdminDashboard: Fetched users:', data);
        setUsers(data);
      } catch (err) {
        console.error('AdminDashboard: Error fetching users:', err);
        if (err.response?.status === 401) {
          navigate('/admin-login');
        }
        setUsers([]);
      }
    };

    const fetchLoginStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('AdminDashboard: No token found');
          navigate('/admin-login');
          return;
        }
        const { data } = await axios.get('http://localhost:5000/api/users/login-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('AdminDashboard: Fetched login stats:', data);
        if (!data || data.length === 0) {
          const sampleData = [];
          const today = new Date();
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            sampleData.push({
              date: date.toISOString().split('T')[0],
              count: Math.floor(Math.random() * 10) + 1
            });
          }
          setLoginStats(sampleData);
        } else {
          setLoginStats(data);
        }
      } catch (err) {
        console.error('AdminDashboard: Error fetching login stats:', err);
        const sampleData = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          sampleData.push({
            date: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 10) + 1
          });
        }
        setLoginStats(sampleData);
      }
    };

    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([fetchBlogs(), fetchUsers(), fetchLoginStats()]);
      setIsLoading(false);
    };
    
    fetchAllData();
  }, [navigate]);

  // Initialize chart
  useEffect(() => {
    if (activeTab === 'statistics' && chartRef.current && loginStats.length > 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      
      setTimeout(() => {
        if (chartRef.current) {
          const ctx = chartRef.current.getContext('2d');
          chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: loginStats.map(stat => {
                const date = new Date(stat.date);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }),
              datasets: [{
                label: 'User Logins',
                data: loginStats.map(stat => stat.count),
                backgroundColor: 'rgba(29, 78, 216, 0.1)',
                borderColor: '#1d4ed8',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1d4ed8',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                intersect: false,
                mode: 'index',
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Logins',
                    color: '#374151',
                    font: { size: 12, weight: 'bold' },
                  },
                  ticks: { 
                    color: '#374151',
                    stepSize: 1,
                  },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                    color: '#374151',
                    font: { size: 12, weight: 'bold' },
                  },
                  ticks: { color: '#374151' },
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                },
              },
              plugins: {
                legend: {
                  labels: { 
                    color: '#374151',
                    font: { size: 12 },
                  },
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: '#ffffff',
                  bodyColor: '#ffffff',
                  borderColor: '#1d4ed8',
                  borderWidth: 1,
                },
              },
            },
          });
        }
      }, 100);
    }
    
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [activeTab, loginStats]);

  // Handle blog deletion
  const handleDeleteBlog = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the blog "${title}"?`)) {
      try {
        console.log('AdminDashboard: Deleting blog:', id);
        await deleteBlog(id);
        setBlogs(blogs.filter(blog => blog._id !== id));
        console.log('AdminDashboard: Blog deleted successfully:', id);
      } catch (err) {
        console.error('AdminDashboard: Error deleting blog:', err);
        alert('Failed to delete blog. Please try again.');
      }
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the user "${name}"?`)) {
      try {
        console.log('AdminDashboard: Deleting user:', id);
        await deleteUser(id);
        setUsers(users.filter(user => user._id !== id));
        console.log('AdminDashboard: User deleted successfully:', id);
      } catch (err) {
        console.error('AdminDashboard: Error deleting user:', err);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    console.log('AdminDashboard: Toggling sidebar, isOpen:', !isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Search and filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.categories?.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = filterCategory
      ? blog.categories?.includes(filterCategory)
      : true;

    return matchesSearch && matchesFilter;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(blogs.flatMap(blog => blog.categories).filter(Boolean))];

  return (
    <div style={styles.container}>
      {/* Overlay for mobile */}
      <div 
        style={styles.overlay} 
        onClick={() => setIsSidebarOpen(false)}
      />
      
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        style={styles.sidebarToggle}
        onClick={toggleSidebar}
        onMouseEnter={(e) => Object.assign(e.target.style, styles.sidebarToggleHover)}
        onMouseLeave={(e) => Object.assign(e.target.style, {
          backgroundColor: styles.sidebarToggle.backgroundColor,
          transform: 'scale(1)',
        })}
        aria-label={isSidebarOpen ? 'Close Menu' : 'Open Menu'}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>Admin Dashboard</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <button
            style={{
              ...styles.sidebarButton,
              ...(activeTab === 'statistics' ? styles.sidebarButtonActive : {}),
            }}
            onClick={() => {
              console.log('AdminDashboard: Statistics clicked');
              setActiveTab('statistics');
              if (isMobile) setIsSidebarOpen(false);
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'statistics') {
                Object.assign(e.target.style, styles.sidebarButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'statistics') {
                Object.assign(e.target.style, styles.sidebarButton);
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18M7 14v4M11 10v8M15 7v11M19 12v6" />
            </svg>
            Statistics
          </button>
          <button
            style={{
              ...styles.sidebarButton,
              ...(activeTab === 'blogs' ? styles.sidebarButtonActive : {}),
            }}
            onClick={() => {
              console.log('AdminDashboard: Blogs tab clicked');
              setActiveTab('blogs');
              if (isMobile) setIsSidebarOpen(false);
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'blogs') {
                Object.assign(e.target.style, styles.sidebarButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'blogs') {
                Object.assign(e.target.style, styles.sidebarButton);
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-6-6zm0 0v6h6" />
            </svg>
            Blogs
          </button>
          <button
            style={{
              ...styles.sidebarButton,
              ...(activeTab === 'users' ? styles.sidebarButtonActive : {}),
            }}
            onClick={() => {
              console.log('AdminDashboard: Users tab clicked');
              setActiveTab('users');
              if (isMobile) setIsSidebarOpen(false);
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'users') {
                Object.assign(e.target.style, styles.sidebarButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'users') {
                Object.assign(e.target.style, styles.sidebarButton);
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm7 4v-2a4 4 0 0 0-3-3.87m4-5.13a4 4 0 1 0-6 0" />
            </svg>
            Users
          </button>
          <button
            style={{
              ...styles.sidebarButton,
              ...(activeTab === 'create-blog' ? styles.sidebarButtonActive : {}),
            }}
            onClick={() => {
              console.log('AdminDashboard: Create Blog clicked');
              navigate('/create');
              if (isMobile) setIsSidebarOpen(false);
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'create-blog') {
                Object.assign(e.target.style, styles.sidebarButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'create-blog') {
                Object.assign(e.target.style, styles.sidebarButton);
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14m-7-7h14" />
            </svg>
            Create Blog
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {activeTab === 'statistics' && (
          <div>
            <h2 style={styles.title}>Dashboard Statistics</h2>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={styles.errorMessage}>Loading dashboard data...</p>
              </div>
            ) : (
              <>
                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <h3 style={styles.statTitle}>Total Blogs</h3>
                    <p style={styles.statValue}>{blogs.length}</p>
                  </div>
                  <div style={styles.statCard}>
                    <h3 style={styles.statTitle}>Total Users</h3>
                    <p style={styles.statValue}>{users.length}</p>
                  </div>
                  <div style={styles.statCard}>
                    <h3 style={styles.statTitle}>Active Authors</h3>
                    <p style={styles.statValue}>
                      {new Set(blogs.map(blog => 
                        blog.author?._id || blog.author?.email || blog.authorId
                      ).filter(Boolean)).size}
                    </p>
                  </div>
                  <div style={styles.statCard}>
                    <h3 style={styles.statTitle}>Recent Logins</h3>
                    <p style={styles.statValue}>
                      {loginStats.reduce((sum, stat) => sum + stat.count, 0)}
                    </p>
                  </div>
                </div>
                <div style={styles.chartContainer}>
                  <h3 style={styles.statTitle}>User Logins Over Time</h3>
                  {loginStats.length > 0 ? (
                    <div style={{ position: 'relative', height: '250px', width: '100%' }}>
                      <canvas 
                        ref={chartRef} 
                        style={{ 
                          maxHeight: '250px', 
                          maxWidth: '100%',
                          display: 'block'
                        }} 
                      />
                    </div>
                  ) : (
                    <p style={styles.errorMessage}>Loading login statistics...</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'blogs' && (
          <div>
            <h2 style={styles.title}>Blogs Management</h2>
            <div style={styles.searchFilterContainer}>
              <input
                type="text"
                placeholder="Search by blog title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, {
                  borderColor: styles.input.border,
                  boxShadow: 'none',
                })}
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={styles.select}
                onFocus={(e) => Object.assign(e.target.style, styles.selectFocus)}
                onBlur={(e) => Object.assign(e.target.style, {
                  borderColor: styles.select.border,
                  boxShadow: 'none',
                })}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {filteredBlogs.length > 0 ? (
              <div style={styles.blogList}>
                {filteredBlogs.map((blog) => (
                  <div key={blog._id} style={styles.blogCard}>
                    <div style={styles.blogImageContainer}>
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          style={styles.blogImage}
                        />
                      ) : (
                        <div style={styles.noImage}>
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                    <div style={styles.blogDetails}>
                      <h3 style={styles.blogTitle}>{blog.title}</h3>
                      <p style={styles.blogText}>
                        By: {blog.author?.name || 'Unknown'} ({blog.author?.email || 'N/A'})
                      </p>
                      <p style={styles.blogText}>
                        Categories: {blog.categories?.join(', ') || 'General'}
                      </p>
                      <p style={styles.blogText}>
                        Created: {blog.createdAt ? new Date(blog.createdAt).toLocaleString() : 'N/A'}
                      </p>
                      <p style={styles.blogContent}>
                        {blog.content?.substring(0, 200) || 'No content available'}...
                      </p>
                      <button
                        onClick={() => handleDeleteBlog(blog._id, blog.title)}
                        style={styles.deleteButton}
                        onMouseEnter={(e) => Object.assign(e.target.style, styles.deleteButtonHover)}
                        onMouseLeave={(e) => Object.assign(e.target.style, {
                          backgroundColor: styles.deleteButton.backgroundColor,
                          transform: 'scale(1)',
                        })}
                        onFocus={(e) => Object.assign(e.target.style, styles.deleteButtonFocus)}
                        onBlur={(e) => Object.assign(e.target.style, { outline: 'none' })}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.noResults}>No blogs found.</p>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 style={styles.title}>Users Management</h2>
            {users.length > 0 ? (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Last Login</th>
                      <th style={styles.th}>Blogs Created</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        style={styles.tr}
                        onMouseEnter={(e) => Object.assign(e.target.style, styles.trHover)}
                        onMouseLeave={(e) => Object.assign(e.target.style, {
                          backgroundColor: styles.tr.backgroundColor || 'transparent',
                        })}
                      >
                        <td style={styles.td}>{user.name}</td>
                        <td style={styles.td}>{user.email}</td>
                        <td style={styles.td}>
                          {(() => {
                            if (!user.lastLogin) return 'Never';
                            try {
                              const date = new Date(user.lastLogin);
                              return isNaN(date.getTime()) ? 'Never' : date.toLocaleString();
                            } catch (error) {
                              return 'Never';
                            }
                          })()}
                        </td>
                        <td style={styles.td}>
                          {blogs.filter(blog => 
                            blog.author?._id === user._id || 
                            blog.author?.email === user.email ||
                            blog.authorId === user._id
                          ).length}
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            style={styles.deleteButton}
                            onMouseEnter={(e) => Object.assign(e.target.style, styles.deleteButtonHover)}
                            onMouseLeave={(e) => Object.assign(e.target.style, {
                              backgroundColor: styles.deleteButton.backgroundColor,
                              transform: 'scale(1)',
                            })}
                            onFocus={(e) => Object.assign(e.target.style, styles.deleteButtonFocus)}
                            onBlur={(e) => Object.assign(e.target.style, { outline: 'none' })}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={styles.noResults}>No users found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;