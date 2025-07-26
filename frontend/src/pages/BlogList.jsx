import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import BlogCards from '../components/BlogCards';
import { getBlogs, deleteBlog, deleteUser, updateUserProfile, updateUserPassword } from '../api/api';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BlogList = ({ user }) => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('statistics');
  const [stats, setStats] = useState({
    totalBlogs: 0,
    userBlogCount: 0,
    totalLikes: 0,
  });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [settingsError, setSettingsError] = useState(null);
  const [settingsSuccess, setSettingsSuccess] = useState(null);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const navigate = useNavigate();

  // Predefined categories (from CreateBlog.jsx)
  const predefinedCategories = [
    "Personal", "Lifestyle", "Travel", "Food & Recipes", "Health & Fitness", "Medical",
    "Nature & Environment", "Technology", "Education", "Finance & Investing", "Parenting",
    "Fashion", "Beauty & Skincare", "Photography", "Art & Design", "DIY & Crafts",
    "Spirituality & Religion", "Career & Self-Development", "Books & Literature",
    "Movies & Entertainment", "Gaming", "Music", "News & Politics", "Real Estate",
    "Automobiles & Vehicles", "Marketing & Business", "Product Reviews", "Coding & Programming",
    "Mental Health", "Relationships & Dating", "Pets & Animals", "Gardening", "History & Culture",
    "Language Learning", "Legal & Law"
  ];

  // Internal styles
  const styles = {
    container: {
      display: 'flex',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#f4f5f7',
      position: 'relative',
      marginTop: '64px',
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
    statsContainer: {
      padding: '24px',
      maxWidth: '1200px',
      width: '100%',
      margin: '16px auto',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '32px',
    },
    statCard: {
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    statLabel: {
      fontWeight: '600',
      fontSize: '16px',
      color: '#1e293b',
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
    },
    chartWrapper: {
      height: '80px',
    },
    pieChartContainer: {
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '400px',
      margin: '0 auto',
    },
    mainContent: {
      flex: 1,
      padding: '24px',
      maxWidth: '1200px',
      marginLeft: '240px',
    },
    noBlogsMessage: {
      color: '#6b7280',
      padding: '16px',
      textAlign: 'center',
      fontSize: '16px',
      fontStyle: 'italic',
    },
    blogsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '16px',
      marginTop: '16px',
    },
    loadingMessage: {
      color: '#6b7280',
      padding: '16px',
      textAlign: 'center',
      fontSize: '16px',
    },
    errorMessage: {
      color: '#ef4444',
      padding: '16px',
      textAlign: 'center',
      fontSize: '16px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      margin: '16px 0',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#111827',
    },
    settingsContainer: {
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      padding: '24px',
      maxWidth: '672px',
      width: '100%',
    },
    settingsSection: {
      marginBottom: '32px',
    },
    settingsSubTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '16px',
    },
    settingsInputContainer: {
      marginBottom: '16px',
    },
    settingsLabel: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '4px',
    },
    settingsInput: {
      width: '100%',
      padding: '8px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      outline: 'none',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    settingsInputFocus: {
      borderColor: '#1d4ed8',
      boxShadow: '0 0 0 3px rgba(29, 78, 216, 0.3)',
    },
    settingsButton: {
      width: '100%',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    settingsButtonPrimary: {
      backgroundColor: '#1d4ed8',
      color: '#ffffff',
    },
    settingsButtonPrimaryHover: {
      backgroundColor: '#1e40af',
      transform: 'scale(1.02)',
    },
    settingsButtonDanger: {
      backgroundColor: '#dc2626',
      color: '#ffffff',
    },
    settingsButtonDangerHover: {
      backgroundColor: '#b91c1c',
      transform: 'scale(1.02)',
    },
    settingsNote: {
      fontSize: '0.875rem',
      color: '#4b5563',
      marginBottom: '16px',
    },
    searchFilterContainer: {
      padding: '16px',
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb',
      flexWrap: 'wrap',
    },
    searchInput: {
      padding: '8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      width: '100%',
      maxWidth: '384px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s ease',
    },
    searchInputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    select: {
      padding: '8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none',
      minWidth: '160px',
      transition: 'border-color 0.2s ease',
    },
    selectFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getBlogs();
        console.log('Fetched blogs:', data);
        
        setBlogs(data || []);
        setFilteredBlogs(data || []);

        // Fetch and combine categories
        const fetchedCategories = [...new Set(data.flatMap((blog) => blog.categories))];
        const allCategories = [...new Set([...predefinedCategories, ...fetchedCategories])];
        setCategories(allCategories);

        if (user && user.id) {
          const userBlogs = data.filter(blog => blog.author?._id === user.id);
          setUserBlogs(userBlogs);

          const totalLikes = userBlogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
          setStats({
            totalBlogs: data.length,
            userBlogCount: userBlogs.length,
            totalLikes,
          });

          setFormData({
            username: user.name || user.username || '',
            email: user.email || '',
          });
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    if (!searchValue.trim()) {
      setFilteredBlogs(activeTab === 'dashboard' ? userBlogs : blogs);
    } else {
      const targetBlogs = activeTab === 'dashboard' ? userBlogs : blogs;
      setFilteredBlogs(
        targetBlogs.filter((b) => b.title.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }
  };

  const handleFilter = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    const targetBlogs = activeTab === 'dashboard' ? userBlogs : blogs;
    if (!category) {
      setFilteredBlogs(targetBlogs);
    } else {
      setFilteredBlogs(targetBlogs.filter((b) => b.categories.includes(category)));
    }
  };

  const handleSort = (e) => {
    const sortValue = e.target.value;
    setSortOption(sortValue);
    const targetBlogs = activeTab === 'dashboard' ? userBlogs : filteredBlogs;
    let sortedBlogs = [...targetBlogs];

    switch (sortValue) {
      case 'date-desc':
        sortedBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'date-asc':
        sortedBlogs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'title-asc':
        sortedBlogs.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sortedBlogs.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        sortedBlogs = targetBlogs;
    }

    setFilteredBlogs(sortedBlogs);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      const updatedUserBlogs = userBlogs.filter((b) => b._id !== id);
      setBlogs(blogs.filter((b) => b._id !== id));
      setFilteredBlogs(filteredBlogs.filter((b) => b._id !== id));
      setUserBlogs(updatedUserBlogs);
      setStats((prev) => ({
        ...prev,
        userBlogCount: updatedUserBlogs.length,
        totalLikes: updatedUserBlogs.reduce((sum, blog) => sum + (blog.likes || 0), 0),
      }));
    } catch (err) {
      alert('Failed to delete blog');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        name: formData.username,
        email: formData.email,
      };
      await updateUserProfile(user.id, profileData);
      setSettingsSuccess('Profile updated successfully!');
      setSettingsError(null);
      
      const updatedUser = { ...user, name: formData.username, email: formData.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setSettingsError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      setSettingsSuccess(null);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setSettingsError('New passwords do not match.');
      setSettingsSuccess(null);
      return;
    }
    try {
      const passwordUpdateData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };
      await updateUserPassword(user.id, passwordUpdateData);
      setSettingsSuccess('Password updated successfully!');
      setSettingsError(null);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      setSettingsError(err.response?.data?.message || 'Failed to update password. Please check your current password.');
      setSettingsSuccess(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteUser(user.id);
        navigate('/login');
      } catch (err) {
        setSettingsError('Failed to delete account. Please try again.');
        setSettingsSuccess(null);
      }
    }
  };

  // Chart.js data for bar charts
  const getBarChartData = (value, color, label) => ({
    labels: [label],
    datasets: [{
      data: [value],
      backgroundColor: [color],
      borderColor: ['#ffffff'],
      borderWidth: 1,
    }],
  });

  // Chart.js options for bar charts
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#1e293b' },
      },
      x: {
        ticks: { color: '#1e293b' },
      },
    },
  };

  // Chart.js data for pie chart
  const pieChartData = {
    labels: ['Total Blogs', 'My Blogs', 'Total Likes'],
    datasets: [{
      data: [stats.totalBlogs, stats.userBlogCount, stats.totalLikes],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      borderColor: ['#ffffff', '#ffffff', '#ffffff "'],
      borderWidth: 2,
    }],
  };

  // Chart.js options for pie chart
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14 },
          color: '#1e293b',
        },
      },
      tooltip: { enabled: true },
    },
  };

  if (!user) {
    return (
      <div style={styles.mainContent}>
        <div style={styles.errorMessage}>
          Please log in to view the blog list or settings.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.mainContent}>
        <p style={styles.loadingMessage}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.mainContent}>
        <div style={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>Dashboard</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <button
            style={{
              ...styles.sidebarButton,
              ...(activeTab === 'statistics' ? styles.sidebarButtonActive : {}),
            }}
            onClick={() => setActiveTab('statistics')}
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
              ...(activeTab === 'allBlogs' ? styles.sidebarButtonActive : {}),
            }}
            onClick={() => setActiveTab('allBlogs')}
            onMouseEnter={(e) => {
              if (activeTab !== 'allBlogs') {
                Object.assign(e.target.style, styles.sidebarButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'allBlogs') {
                Object.assign(e.target.style, styles.sidebarButton);
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-6-6zm0 0v6h6" />
            </svg>
            All Blogs
          </button>
          <button
            style={{
              ...styles.sidebarButton,
              ...(activeTab === 'dashboard' ? styles.sidebarButtonActive : {}),
            }}
            onClick={() => setActiveTab('dashboard')}
            onMouseEnter={(e) => {
              if (activeTab !== 'dashboard') {
                Object.assign(e.target.style, styles.sidebarButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'dashboard') {
                Object.assign(e.target.style, styles.sidebarButton);
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h7v7H3zm7 7h7v7h-7zm7-7h4v4h-4zM3 17h7v4H3z" />
            </svg>
            My Dashboard
          </button>
          <button
            style={styles.sidebarButton}
            onClick={() => navigate('/create')}
            onMouseEnter={(e) => {
              Object.assign(e.target.style, styles.sidebarButtonHover);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.target.style, styles.sidebarButton);
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14m-7-7h14" />
            </svg>
            Create Blog
          </button>
          <button
            style={{
              ...styles.sidebarButton,
              ...(activeTab === 'settings' ? styles.sidebarButtonActive : {}),
            }}
            onClick={() => setActiveTab('settings')}
            onMouseEnter={(e) => {
              if (activeTab !== 'settings') {
                Object.assign(e.target.style, styles.sidebarButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'settings') {
                Object.assign(e.target.style, styles.sidebarButton);
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 0c1.5 0 2.7 1.2 2.7 2.7m-5.4 0c0-1.5 1.2-2.7 2.7-2.7m0 0c-1.5 0-2.7-1.2-2.7-2.7m5.4 0c0 1.5-1.2 2.7-2.7 2.7" />
            </svg>
            Settings
          </button>
          <div style={{ flex: 1 }} />
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {activeTab === 'statistics' ? (
          <div style={styles.statsContainer}>
            <h2 style={styles.sectionTitle}>Statistics</h2>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Total Blogs</div>
                <div style={styles.statValue}>{stats.totalBlogs}</div>
                <div style={styles.chartWrapper}>
                  <Bar
                    data={getBarChartData(stats.totalBlogs, '#3b82f6', 'Total Blogs')}
                    options={barChartOptions}
                  />
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>My Blogs</div>
                <div style={styles.statValue}>{stats.userBlogCount}</div>
                <div style={styles.chartWrapper}>
                  <Bar
                    data={getBarChartData(stats.userBlogCount, '#10b981', 'My Blogs')}
                    options={barChartOptions}
                  />
                </div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Total Likes</div>
                <div style={styles.statValue}>{stats.totalLikes}</div>
                <div style={styles.chartWrapper}>
                  <Bar
                    data={getBarChartData(stats.totalLikes, '#f59e0b', 'Total Likes')}
                    options={barChartOptions}
                  />
                </div>
              </div>
            </div>
            <div style={styles.pieChartContainer}>
              <h3 style={styles.statLabel}>Distribution of Stats</h3>
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div style={styles.settingsContainer}>
            <h2 style={styles.sectionTitle}>Settings</h2>

            {settingsError && (
              <div style={styles.errorMessage}>{settingsError}</div>
            )}
            {settingsSuccess && (
              <div
                style={{
                  ...styles.errorMessage,
                  color: '#15803d',
                  backgroundColor: '#f0fdf4',
                  borderColor: '#bbf7d0',
                }}
              >
                {settingsSuccess}
              </div>
            )}

            {/* Profile Update Section */}
            <div style={styles.settingsSection}>
              <h3 style={styles.settingsSubTitle}>Update Profile</h3>
              <div style={styles.settingsInputContainer}>
                <label htmlFor="username" style={styles.settingsLabel}>
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  style={styles.settingsInput}
                  onFocus={(e) => {
                    e.target.style.borderColor = styles.settingsInputFocus.borderColor;
                    e.target.style.boxShadow = styles.settingsInputFocus.boxShadow;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="Enter your username"
                />
              </div>
              <div style={styles.settingsInputContainer}>
                <label htmlFor="email" style={styles.settingsLabel}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={styles.settingsInput}
                  onFocus={(e) => {
                    e.target.style.borderColor = styles.settingsInputFocus.borderColor;
                    e.target.style.boxShadow = styles.settingsInputFocus.boxShadow;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="Enter your email"
                />
              </div>
              <button
                onClick={handleProfileUpdate}
                style={{
                  ...styles.settingsButton,
                  ...styles.settingsButtonPrimary,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = styles.settingsButtonPrimaryHover.backgroundColor;
                  e.target.style.transform = styles.settingsButtonPrimaryHover.transform;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = styles.settingsButtonPrimary.backgroundColor;
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Update Profile
              </button>
            </div>

            {/* Password Update Section */}
            <div style={styles.settingsSection}>
              <h3 style={styles.settingsSubTitle}>Change Password</h3>
              <div style={styles.settingsInputContainer}>
                <label htmlFor="currentPassword" style={styles.settingsLabel}>
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  style={styles.settingsInput}
                  onFocus={(e) => {
                    e.target.style.borderColor = styles.settingsInputFocus.borderColor;
                    e.target.style.boxShadow = styles.settingsInputFocus.boxShadow;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="Enter current password"
                />
              </div>
              <div style={styles.settingsInputContainer}>
                <label htmlFor="newPassword" style={styles.settingsLabel}>
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  style={styles.settingsInput}
                  onFocus={(e) => {
                    e.target.style.borderColor = styles.settingsInputFocus.borderColor;
                    e.target.style.boxShadow = styles.settingsInputFocus.boxShadow;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="Enter new password"
                />
              </div>
              <div style={styles.settingsInputContainer}>
                <label htmlFor="confirmNewPassword" style={styles.settingsLabel}>
                  Confirm New Password
                </label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                  }
                  style={styles.settingsInput}
                  onFocus={(e) => {
                    e.target.style.borderColor = styles.settingsInputFocus.borderColor;
                    e.target.style.boxShadow = styles.settingsInputFocus.boxShadow;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                  }}
                  placeholder="Confirm new password"
                />
              </div>
              <button
                onClick={handlePasswordUpdate}
                style={{
                  ...styles.settingsButton,
                  ...styles.settingsButtonPrimary,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = styles.settingsButtonPrimaryHover.backgroundColor;
                  e.target.style.transform = styles.settingsButtonPrimaryHover.transform;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = styles.settingsButtonPrimary.backgroundColor;
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Change Password
              </button>
            </div>

            {/* Delete Account Section */}
            <div style={styles.settingsSection}>
              <h3 style={styles.settingsSubTitle}>Delete Account</h3>
              <p style={styles.settingsNote}>
                Deleting your account is permanent and cannot be undone.
              </p>
              <button
                onClick={handleDeleteAccount}
                style={{
                  ...styles.settingsButton,
                  ...styles.settingsButtonDanger,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = styles.settingsButtonDangerHover.backgroundColor;
                  e.target.style.transform = styles.settingsButtonDangerHover.transform;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = styles.settingsButtonDanger.backgroundColor;
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={styles.searchFilterContainer}>
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={handleSearch}
                style={styles.searchInput}
                onFocus={(e) => {
                  Object.assign(e.target.style, styles.searchInputFocus);
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.searchInput.borderColor;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <select 
                value={selectedCategory}
                onChange={handleFilter}
                style={styles.select}
                onFocus={(e) => {
                  Object.assign(e.target.style, styles.selectFocus);
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.select.borderColor;
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Filter by Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={sortOption}
                onChange={handleSort}
                style={styles.select}
                onFocus={(e) => {
                  Object.assign(e.target.style, styles.selectFocus);
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = styles.select.borderColor;
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Sort By</option>
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
            </div>
            <h2 style={styles.sectionTitle}>
              {activeTab === 'dashboard' ? 'My Blogs' : 'All Blogs'}
            </h2>
            {filteredBlogs.length === 0 ? (
              <p style={styles.noBlogsMessage}>
                {activeTab === 'dashboard' && userBlogs.length === 0
                  ? 'You haven’t created any blogs yet. Start by creating one!'
                  : 'No blogs match your search criteria.'}
              </p>
            ) : (
              <div style={styles.blogsGrid}>
                {(activeTab === 'dashboard' ? userBlogs : filteredBlogs).map((blog) => (
                  <BlogCards
                    key={blog._id}
                    blog={blog}
                    onDelete={handleDelete}
                    user={user}
                    showFullDetails={activeTab === 'dashboard'}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogList;