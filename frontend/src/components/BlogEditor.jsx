const BlogEditor = ({ value, onChange }) => {
  // Internal styles
  const styles = {
    container: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      color: '#374151',
      marginBottom: '8px',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    textarea: {
      width: '100%',
      padding: '8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      height: '192px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    },
    textareaFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    }
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>Content:</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your blog content here..."
        style={styles.textarea}
        onFocus={(e) => {
          Object.assign(e.target.style, styles.textareaFocus);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = styles.textarea.borderColor;
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
};

export default BlogEditor;