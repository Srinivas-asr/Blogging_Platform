import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BlogList from './pages/BlogList';
import BlogDetails from './pages/BlogDetails';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import About from './pages/About';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    console.log('App.jsx: localStorage user:', savedUser);
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('App.jsx: Parsed user:', parsedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('App.jsx: Error parsing user from localStorage:', err);
        localStorage.removeItem('user'); // Clear invalid user
      }
    }
  }, []);

  useEffect(() => {
    console.log('App.jsx: user state updated:', user);
  }, [user]);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/"
          element={user ? <BlogList user={user} /> : <Navigate to="/home" />}
        />
        <Route
          path="/blog/:id"
          element={user ? <BlogDetails user={user} /> : <Navigate to="/home" />}
        />
        <Route
          path="/create"
          element={user ? <CreateBlog user={user} /> : <Navigate to="/home" />}
        />
        <Route
          path="/edit/:id"
          element={user ? <EditBlog user={user} /> : <Navigate to="/home" />}
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route
          path="/admin"
          element={
            user && user.role === 'admin' ? (
              <AdminDashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;