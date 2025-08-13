import { useEffect } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const Welcome = () => {
  useEffect(() => {
    document.title = 'Welcome to X-Twitter';
  }, []);

  return (
    <div className="min-h-screen bg-x-black">
      <Navbar user={null} />
      <main className="flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-6">Welcome to X-Twitter</h1>
          <p className="text-xl text-x-text-gray mb-8">Join the conversation. Share your thoughts, follow friends, and stay updated.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary">Create account</Link>
            <Link to="/login" className="btn-secondary">Sign in</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
