import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogEditor from '../components/BlogEditor';
import { createBlog } from '../api/api';

const CreateBlog = ({ user }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [manualCategories, setManualCategories] = useState("");
  const [image, setImage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Predefined categories
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
    select: {
      width: '100%',
      padding: '12px',
      marginBottom: '20px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.9rem',
      fontFamily: '"Inter", sans-serif',
      color: '#374151',
      outline: 'none',
      backgroundColor: '#ffffff',
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
      width: 'auto',
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
      resizeAndConvertToBase64(file);
    } else {
      alert("Please drop a valid image file (jpg, png, gif, webp)");
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      resizeAndConvertToBase64(file);
    } else {
      alert("Please select a valid image file (jpg, png, gif, webp)");
    }
  };

  const resizeAndConvertToBase64 = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 300, 200);
        const resizedImage = canvas.toDataURL('image/jpeg');
        console.log(`Resized image dimensions: 300x200`);
        setImage(resizedImage);
      };
      img.onerror = () => {
        alert("Failed to load the image");
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      alert("Failed to read the image file");
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setSelectedCategories(selectedOptions);
  };

  const handleCreate = async () => {
    if (!title || !content) {
      alert("Please fill in all required fields (Title, Content)");
      return;
    }

    // Combine selected categories from dropdown and manual input
    const manualCategoryArray = manualCategories
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat);
    const categoryArray = [...new Set([...selectedCategories, ...manualCategoryArray])];
    
    if (categoryArray.length === 0) {
      alert("Please provide at least one valid category");
      return;
    }

    if (!user || !user.id) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    const newBlog = {
      title,
      content,
      author: user.id,
      categories: categoryArray,
      image: image || "",
    };

    console.log("Sending blog data:", newBlog);

    try {
      const { data } = await createBlog(newBlog);
      console.log("Blog created:", data);
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create blog';
      alert(errorMessage);
      console.error('Error creating blog:', err.response?.data || err);
    }
  };

  if (!user) {
    return (
      <div style={styles.loginMessage}>
        Please log in to create a blog
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create Blog</h1>
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
            Drag and drop an image here, or click to select an image
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
      <BlogEditor value={content} onChange={setContent} />
      <label style={styles.label}>Categories (Select or Enter Manually)</label>
      <select
        multiple
        value={selectedCategories}
        onChange={handleCategoryChange}
        style={styles.select}
        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
        onBlur={(e) => {
          e.target.style.borderColor = styles.input.borderColor;
          e.target.style.boxShadow = 'none';
        }}
      >
        {predefinedCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Enter custom categories (comma-separated, e.g., Technology, Lifestyle)"
        value={manualCategories}
        onChange={(e) => setManualCategories(e.target.value)}
        style={styles.input}
        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
        onBlur={(e) => {
          e.target.style.borderColor = styles.input.borderColor;
          e.target.style.boxShadow = 'none';
        }}
      />
      <button
        onClick={handleCreate}
        style={styles.button}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, styles.buttonHover);
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = styles.button.backgroundColor;
          e.target.style.transform = 'scale(1)';
        }}
      >
        Create Blog
      </button>
    </div>
  );
};

export default CreateBlog;