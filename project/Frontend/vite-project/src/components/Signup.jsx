import { useState , useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  useEffect(() => {
        document.title = 'Sign Up';
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
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await axios.post('/api/auth/signup', {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || 'Signup failed');
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
          <h1 className="text-white text-3xl font-bold mb-3">Create Account</h1>
          <p className="text-gray-400 text-base">Join our community today!</p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg mb-5 font-medium text-center w-full ${
            message.includes('successfully') 
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
              placeholder="Enter username"
            />
            {errors.username && <span className="text-red-400 text-sm mt-1">{errors.username}</span>}
          </div>

          <div className="flex flex-col gap-2 w-full items-center">
            <label htmlFor="fullName" className="font-medium text-sm text-gray-300 text-center w-full">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`input-field ${errors.fullName ? 'border-red-600 bg-red-900/20' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <span className="text-red-400 text-sm mt-1">{errors.fullName}</span>}
          </div>

          <div className="flex flex-col gap-2 w-full items-center">
            <label htmlFor="email" className="font-medium text-sm text-gray-300 text-center w-full">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? 'border-red-600 bg-red-900/20' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <span className="text-red-400 text-sm mt-1">{errors.email}</span>}
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
              placeholder="Enter password"
            />
            {errors.password && <span className="text-red-400 text-sm mt-1">{errors.password}</span>}
          </div>

          <div className="flex flex-col gap-2 w-full items-center">
            <label htmlFor="confirmPassword" className="font-medium text-sm text-gray-300 text-center w-full">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`input-field ${errors.confirmPassword ? 'border-red-600 bg-red-900/20' : ''}`}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <span className="text-red-400 text-sm mt-1">{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className="bg-white text-black border-none rounded-lg py-4 text-base font-semibold cursor-pointer transition-all duration-300 w-full max-w-xs mx-auto hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed relative" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            {loading && (
              <div className="absolute w-4 h-4 top-1/2 left-1/2 -ml-2 -mt-2 border-2 border-transparent border-t-black rounded-full animate-spin"></div>
            )}
          </button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-gray-700 w-full">
          <p className="text-gray-500">Already have an account? <a href="/login" className="text-gray-300 no-underline font-semibold hover:underline">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signup; 