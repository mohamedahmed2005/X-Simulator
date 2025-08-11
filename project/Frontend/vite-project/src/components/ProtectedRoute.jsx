import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/me', { withCredentials: true });
        if (isMounted) setAuthorized(!!res.data?.success);
      } catch (err) {
        if (isMounted) setAuthorized(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    checkAuth();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Checking authentication...</div>;
  if (!authorized) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;

