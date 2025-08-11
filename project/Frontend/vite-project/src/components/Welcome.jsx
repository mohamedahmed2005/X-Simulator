import Navbar from './Navbar';
import './Welcome.css';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="welcome-page">
      <Navbar user={null} />
      <main className="welcome-hero">
        <div className="welcome-content">
          <h1>Welcome to X-Twitter</h1>
          <p>Join the conversation. Share your thoughts, follow friends, and stay updated.</p>
          <div className="welcome-actions">
            <Link to="/signup" className="cta primary">Create account</Link>
            <Link to="/login" className="cta">Sign in</Link>
          </div>
        </div>
        <div className="welcome-art" aria-hidden="true" />
      </main>
    </div>
  );
};

export default Welcome;

