import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBlogById, updateBlog } from '../api/api';

const EditBlog = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState("");
  const [image, setImage] = useState("");
  const [dragActive, setDragActive] = useState(false);

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
      transition: 'all 0.3s ease',
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: '700',
      marginBottom: '24px',
      color: '#1e293b',
      lineHeight: '1.3',
      letterSpacing: '-0.025em',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '20px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.9rem',
      fontFamily: '"Inter", sans-serif',
      color: '#374151',
      outline: 'none',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    textarea: {
      width: '100%',
      padding: '12px',
      marginBottom: '20px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.9rem',
      fontFamily: '"Inter", sans-serif',
      color: '#374151',
      outline: 'none',
      minHeight: '150px',
      resize: 'vertical',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    inputFocus: {
      borderColor: '#1d4ed8',
      boxShadow: '0 0 0 3px rgba(29, 78, 216, 0.3)',
    },
    dropZone: {
      border: '2px dashed #d1d5db',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '20px',
      textAlign: 'center',
      backgroundColor: '#f9fafb',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    dropZoneActive: {
      borderColor: '#1d4ed8',
      backgroundColor: '#eff6ff',
      transform: 'scale(1.02)',
    },
    dropZoneText: {
      color: '#6b7280',
      fontSize: '0.9rem',
      marginBottom: '12px',
      fontWeight: '500',
    },
    imagePreview: {
      maxWidth: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '6px',
      margin: '0 auto 12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
    },
    imagePreviewHover: {
      transform: 'scale(1.02)',
    },
    hiddenInput: {
      display: 'none',
    },
    label: {
      display: 'block',
      color: '#374151',
      marginBottom: '8px',
      fontSize: '0.9rem',
      fontWeight: '600',
    },
    fileLabel: {
      color: '#1d4ed8',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'underline',
      transition: 'color 0.2s ease',
    },
    fileLabelHover: {
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
      transition: 'background-color 0.2s ease, transform 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonHover: {
      backgroundColor: '#1e40af',
      transform: 'scale(1.05)',
    },
    loginMessage: {
      padding: '24px',
      textAlign: 'center',
      color: '#6b7280',
      fontSize: '1rem',
      fontStyle: 'italic',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      margin: '80px auto',
      maxWidth: '600px',
    },
    errorMessage: {
      padding: '12px',
      color: '#ef4444',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '6px',
      fontSize: '0.85rem',
      marginBottom: '20px',
      textAlign: 'center',
    },
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log('Fetching blog with id:', id);
        const { data } = await getBlogById(id);
        console.log('Blog data received:', data);
        setTitle(data.title || "");
        setContent(data.content || "");
        setCategories(data.categories ? data.categories.join(", ") : "");
        setImage(data.image || "");
      } catch (err) {
        console.error('Error fetching blog:', err);
        alert(err.response?.data?.message || 'Failed to load blog');
      }
    };
    fetchBlog();
  }, [id]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.onerror = () => alert("Failed to read the image file");
      reader.readAsDataURL(file);
    } else {
      alert("Please drop a valid image file (jpg, png, gif, webp)");
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.onerror = () => alert("Failed to read the image file");
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file (jpg, png, gif, webp)");
    }
  };

  const handleUpdate = async () => {
    if (!title || !content || !categories) {
      alert("Please fill in all required fields (Title, Content, Categories)");
      return;
    }

    const categoryArray = categories.split(",").map((cat) => cat.trim()).filter((cat) => cat);
    if (categoryArray.length === 0) {
      alert("Please provide at least one valid category");
      return;
    }

    const updatedBlog = {
      title,
      content,
      author: user.id,
      categories: categoryArray,
      image: image || "",
    };

    try {
      console.log('Updating blog with:', updatedBlog);
      await updateBlog(id, updatedBlog);
      navigate(`/blog/${id}`, { replace: true });
    } catch (err) {
      console.error('Update error:', err);
      alert(err.response?.data?.message || 'Failed to update blog');
    }
  };

  if (!user) {
    return (
      <div style={styles.loginMessage}>
        Please log in to edit a blog
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Edit Blog</h1>
      <label style={styles.label}>Title</label>
      <input
        type="text"
        placeholder="Enter blog title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
        onBlur={(e) => {
          e.target.style.borderColor = styles.input.borderColor;
          e.target.style.boxShadow = 'none';
        }}
        required
      />
      <label style={styles.label}>Content</label>
      <textarea
        placeholder="Enter blog content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={styles.textarea}
        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
        onBlur={(e) => {
          e.target.style.borderColor = styles.textarea.borderColor;
          e.target.style.boxShadow = 'none';
        }}
        required
      />
      <label style={styles.label}>Image</label>
      <div
        style={{
          ...styles.dropZone,
          ...(dragActive ? styles.dropZoneActive : {}),
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {image ? (
          <img
            src={image}
            alt="Preview"
            style={styles.imagePreview}
            onMouseEnter={(e) => {
              e.target.style.transform = styles.imagePreviewHover.transform;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          />
        ) : (
          <p style={styles.dropZoneText}>
            Drag and drop an image here, or click to select
          </p>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          style={styles.hiddenInput}
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          style={styles.fileLabel}
          onMouseEnter={(e) => {
            e.target.style.color = styles.fileLabelHover.color;
          }}
          onMouseLeave={(e) => {
            e.target.style.color = styles.fileLabel.color;
          }}
        >
          {image ? "Change Image" : "Select Image"}
        </label>
      </div>
      <label style={styles.label}>Categories (comma-separated)</label>
      <input
        type="text"
        placeholder="e.g., Technology, Lifestyle, Travel"
        value={categories}
        onChange={(e) => setCategories(e.target.value)}
        style={styles.input}
        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
        onBlur={(e) => {
          e.target.style.borderColor = styles.input.borderColor;
          e.target.style.boxShadow = 'none';
        }}
        required
      />
      <button
        onClick={handleUpdate}
        style={styles.button}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, styles.buttonHover);
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = styles.button.backgroundColor;
          e.target.style.transform = 'scale(1)';
        }}
      >
        Update Blog
      </button>
    </div>
  );
};

export default EditBlog;