import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
      document.title = 'Log in';
    }, []);
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/auth/login', {
        username: formData.username,
        password: formData.password
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || 'Login failed');
      } else {
        setMessage('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-x-black p-5 box-border">
      <div className="bg-x-dark-gray rounded-2xl shadow-2xl shadow-white/5 p-10 w-full max-w-md animate-[slideUp_0.5s_ease-out] flex flex-col items-center justify-center">
        <div className="text-center mb-8 w-full">
          <h1 className="text-white text-3xl font-bold mb-3">Welcome Back</h1>
          <p className="text-gray-400 text-base">Sign in to your account</p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg mb-5 font-medium text-center w-full ${
            message.includes('successful') 
              ? 'bg-green-900/20 text-green-400 border border-green-600' 
              : 'bg-red-900/20 text-red-400 border border-red-600'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full items-center">
          <div className="flex flex-col gap-2 w-full items-center">
            <label htmlFor="username" className="font-medium text-sm text-gray-300 text-center w-full">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`input-field ${errors.username ? 'border-red-600 bg-red-900/20' : ''}`}
              placeholder="Enter your username"
            />
            {errors.username && <span className="text-red-400 text-sm mt-1">{errors.username}</span>}
          </div>

          <div className="flex flex-col gap-2 w-full items-center">
            <label htmlFor="password" className="font-medium text-sm text-gray-300 text-center w-full">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field ${errors.password ? 'border-red-600 bg-red-900/20' : ''}`}
              placeholder="Enter your password"
            />
            {errors.password && <span className="text-red-400 text-sm mt-1">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="bg-white text-black border-none rounded-lg py-4 text-base font-semibold cursor-pointer transition-all duration-300 w-full max-w-xs mx-auto hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed relative" 
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
            {loading && (
              <div className="absolute w-4 h-4 top-1/2 left-1/2 -ml-2 -mt-2 border-2 border-transparent border-t-black rounded-full animate-spin"></div>
            )}
          </button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-gray-700 w-full">
          <p className="text-gray-500">Don't have an account? <a href="/signup" className="text-gray-300 no-underline font-semibold hover:underline">Sign up here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login; 