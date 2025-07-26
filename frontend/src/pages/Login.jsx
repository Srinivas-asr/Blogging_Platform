import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginUser } from '../api/api';

const Login = ({ setUser, isAdminLogin = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState(isAdminLogin ? "admin" : "user");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotDateOfBirth, setForgotDateOfBirth] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [resetStage, setResetStage] = useState(1);
  const navigate = useNavigate();

  const styles = {
    container: {
      padding: '16px',
      maxWidth: '448px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      marginTop: '32px'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '16px',
      textAlign: 'center',
      color: '#111827'
    },
    input: {
      width: '100%',
      padding: '8px',
      marginBottom: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    },
    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    button: {
      width: '100%',
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s ease'
    },
    buttonHover: {
      backgroundColor: '#2563eb'
    },
    link: {
      marginTop: '8px',
      color: '#3b82f6',
      cursor: 'pointer',
      fontSize: '14px',
      textAlign: 'center',
      display: 'block'
    },
    message: {
      marginTop: '8px',
      fontSize: '14px',
      textAlign: 'center'
    },
    successMessage: {
      color: '#10b981'
    },
    errorMessage: {
      color: '#ef4444'
    },
    radioGroup: {
      marginBottom: '16px',
      display: 'flex',
      gap: '16px',
      justifyContent: 'center'
    },
    radioOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer'
    },
    radioInput: {
      margin: '0',
      cursor: 'pointer'
    },
    radioLabel: {
      fontSize: '14px',
      color: '#374151',
      cursor: 'pointer',
      fontWeight: '500'
    }
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Email and Password are required');
      return;
    }

    if (loginType === 'admin') {
      // Simulate admin login for ram@gmail.com and 123456
      if (email === 'ram@gmail.com' && password === '123456') {
        const mockUser = {
          id: 'admin123',
          email: 'ram@gmail.com',
          role: 'admin',
          name: 'Admin User',
          lastLogin: new Date().toISOString()
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', 'mock-admin-token');
        alert('Admin login successful!');
        navigate('/admin');
        return;
      }

      // Actual admin login API call
      try {
        const response = await loginUser({ email, password, role: 'admin' });
        if (response.data && response.data.user && response.data.user.role === 'admin') {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.token);
          alert('Admin login successful!');
          navigate('/admin');
        } else {
          alert('You are not authorized as admin.');
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Admin login failed.');
      }
      return;
    }

    // Handle regular user login
    try {
      const response = await loginUser({ email, password });
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        alert('Login successful!');
        navigate("/");
      } else {
        alert('Invalid response from server');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Server error occurred. Please try again later.');
    }
  };

  const handleForgotPasswordVerify = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotDateOfBirth) {
      setForgotMessage('Email and Date of Birth are required');
      setIsError(true);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/users/forgot-password', {
        email: forgotEmail,
        dateOfBirth: forgotDateOfBirth
      });
      if (response.status === 200) {
        setForgotMessage('Verification successful. Please set a new password.');
        setIsError(false);
        setResetStage(2);
      } else {
        setForgotMessage(response.data.message || 'Failed to verify credentials');
        setIsError(true);
      }
    } catch (err) {
      setForgotMessage(err.response?.data?.message || 'An error occurred. Please try again.');
      setIsError(true);
    }
  };

  const handleForgotPasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setForgotMessage('New Password and Confirm Password are required');
      setIsError(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotMessage('New password and confirm password do not match');
      setIsError(true);
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${forgotEmail}/reset-password`, {
        newPassword
      });
      if (response.status === 200) {
        setForgotMessage(response.data.message || 'Password reset successful');
        setIsError(false);
        setForgotEmail('');
        setForgotDateOfBirth('');
        setNewPassword('');
        setConfirmPassword('');
        setResetStage(1);
        setForgotPassword(false);
      } else {
        setForgotMessage(response.data.message || 'Failed to reset password');
        setIsError(true);
      }
    } catch (err) {
      setForgotMessage(err.response?.data?.message || 'An error occurred. Please try again.');
      setIsError(true);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{isAdminLogin ? 'Admin Login' : 'Login'}</h1>
      {!forgotPassword ? (
        <form onSubmit={handleLogin}>
          {!isAdminLogin && (
            <div style={styles.radioGroup}>
              <div style={styles.radioOption}>
                <input
                  type="radio"
                  id="user"
                  name="loginType"
                  value="user"
                  checked={loginType === 'user'}
                  onChange={() => handleLoginTypeChange('user')}
                  style={styles.radioInput}
                />
                <label htmlFor="user" style={styles.radioLabel}>User Login</label>
              </div>
              <div style={styles.radioOption}>
                <input
                  type="radio"
                  id="admin"
                  name="loginType"
                  value="admin"
                  checked={loginType === 'admin'}
                  onChange={() => handleLoginTypeChange('admin')}
                  style={styles.radioInput}
                />
                <label htmlFor="admin" style={styles.radioLabel}>Admin Login</label>
              </div>
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => {
              e.target.style.borderColor = styles.input.borderColor;
              e.target.style.boxShadow = 'none';
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => {
              e.target.style.borderColor = styles.input.borderColor;
              e.target.style.boxShadow = 'none';
            }}
            required
          />
          <button 
            type="submit" 
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            {loginType === 'admin' || isAdminLogin ? 'Admin Login' : 'User Login'}
          </button>
          <p style={styles.link} onClick={() => setForgotPassword(true)}>
            Forgot Password?
          </p>
        </form>
      ) : resetStage === 1 ? (
        <form onSubmit={handleForgotPasswordVerify}>
          <input
            type="email"
            placeholder="Email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => {
              e.target.style.borderColor = styles.input.borderColor;
              e.target.style.boxShadow = 'none';
            }}
            required
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={forgotDateOfBirth}
            onChange={(e) => setForgotDateOfBirth(e.target.value)}
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => {
              e.target.style.borderColor = styles.input.borderColor;
              e.target.style.boxShadow = 'none';
            }}
            required
          />
          <button 
            type="submit" 
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            Verify
          </button>
          <p style={styles.link} onClick={() => setForgotPassword(false)}>
            Back to Login
          </p>
          {forgotMessage && (
            <p style={{ ...styles.message, ...(isError ? styles.errorMessage : styles.successMessage) }}>
              {forgotMessage}
            </p>
          )}
        </form>
      ) : (
        <form onSubmit={handleForgotPasswordReset}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => {
              e.target.style.borderColor = styles.input.borderColor;
              e.target.style.boxShadow = 'none';
            }}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => {
              e.target.style.borderColor = styles.input.borderColor;
              e.target.style.boxShadow = 'none';
            }}
            required
          />
          <button 
            type="submit" 
            style={styles.button}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            Reset Password
          </button>
          <p style={styles.link} onClick={() => { setResetStage(1); setForgotMessage(''); setIsError(false); }}>
            Back to Verification
          </p>
          {forgotMessage && (
            <p style={{ ...styles.message, ...(isError ? styles.errorMessage : styles.successMessage) }}>
              {forgotMessage}
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default Login;