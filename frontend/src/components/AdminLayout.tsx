import React, { useState } from 'react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem('admin_username') || '');
  const [password, setPassword] = useState(localStorage.getItem('admin_password') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!(username && password));

  const handleLogin = () => {
    localStorage.setItem('admin_username', username);
    localStorage.setItem('admin_password', password);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="login-form card">
          <h1>Admin Login</h1>
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

  return <>{children}</>;
};

export default AdminLayout;
