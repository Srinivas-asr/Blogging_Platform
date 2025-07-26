import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogCards from '../components/BlogCards';
import { getBlogs } from '../api/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Predefined categories (same as in BlogList.jsx for consistency)
  const predefinedCategories = [
    'Personal', 'Lifestyle', 'Travel', 'Food & Recipes', 'Health & Fitness', 'Medical',
    'Nature & Environment', 'Technology', 'Education', 'Finance & Investing', 'Parenting',
    'Fashion', 'Beauty & Skincare', 'Photography', 'Art & Design', 'DIY & Crafts',
    'Spirituality & Religion', 'Career & Self-Development', 'Books & Literature',
    'Movies & Entertainment', 'Gaming', 'Music', 'News & Politics', 'Real Estate',
    'Automobiles & Vehicles', 'Marketing & Business', 'Product Reviews', 'Coding & Programming',
    'Mental Health', 'Relationships & Dating', 'Pets & Animals', 'Gardening', 'History & Culture',
    'Language Learning', 'Legal & Law'
  ];

  // Internal styles (adapted from BlogList.jsx)
  const styles = {
    container: {
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#f4f5f7',
      padding: '24px',
      marginTop: '64px',
      maxWidth: '1200px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#111827',
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
    blogsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '16px',
      marginTop: '16px',
    },
    noBlogsMessage: {
      color: '#6b7280',
      padding: '16px',
      textAlign: 'center',
      fontSize: '16px',
      fontStyle: 'italic',
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
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getBlogs();
        console.log('Blogs.jsx: Fetched blogs:', data);

        setBlogs(data || []);
        setFilteredBlogs(data || []);

        // Fetch and combine categories
        const fetchedCategories = [...new Set(data.flatMap((blog) => blog.categories || []))];
        const allCategories = [...new Set([...predefinedCategories, ...fetchedCategories])];
        setCategories(allCategories);
      } catch (err) {
        console.error('Blogs.jsx: Error fetching blogs:', err);
        setError('Failed to load blogs. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    if (!searchValue.trim()) {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(
        blogs.filter((b) => b.title.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }
  };

  const handleFilter = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (!category) {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter((b) => (b.categories || []).includes(category)));
    }
  };

  const handleSort = (e) => {
    const sortValue = e.target.value;
    setSortOption(sortValue);
    let sortedBlogs = [...filteredBlogs];

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
        sortedBlogs = blogs;
    }

    setFilteredBlogs(sortedBlogs);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingMessage}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.sectionTitle}>All Blogs</h2>
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
      {filteredBlogs.length === 0 ? (
        <p style={styles.noBlogsMessage}>No blogs match your search criteria.</p>
      ) : (
        <div style={styles.blogsGrid}>
          {filteredBlogs.map((blog) => (
            <BlogCards
              key={blog._id}
              blog={blog}
              user={null}
              showFullDetails={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;