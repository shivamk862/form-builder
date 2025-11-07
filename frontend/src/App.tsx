import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import FormBuilder from './pages/FormBuilder';
import Submissions from './pages/Submissions';
import UserForm from './pages/UserForm';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import { AuthProvider } from './hooks/useAuth';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forms/:id" element={<UserForm />} />
          <Route
            path="/admin"
            element={<AdminLayout><AdminDashboard /></AdminLayout>}
          />
          <Route
            path="/admin/forms/:id/builder"
            element={<AdminLayout><FormBuilder /></AdminLayout>}
          />
          <Route
            path="/admin/forms/:id/submissions"
            element={<AdminLayout><Submissions /></AdminLayout>}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;