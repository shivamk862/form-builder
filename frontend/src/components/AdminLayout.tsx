import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, login } = useAuth();

  const handleLogin = async () => {
    setError(null);
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="login-form card">
          <h1>Admin Login</h1>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          <button onClick={handleLogin} className="btn btn-primary">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout-container">
      {children}
    </div>
  );
};

export default AdminLayout;
