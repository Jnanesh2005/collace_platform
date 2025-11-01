import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/auth-context';
import Layout from './components/layout/layout';
import Home from './pages/home';
import Feed from './pages/feed';
import Blips from './pages/blips';
import Search from './pages/search';
import Communities from './pages/communities';
import Profile from './pages/profile';
import Login from './pages/login';
import Register from './pages/register';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return !token ? <>{children}</> : <Navigate to="/feed" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/feed" element={
              <ProtectedRoute>
                <Layout>
                  <Feed />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/blips" element={
              <ProtectedRoute>
                <Layout>
                  <Blips />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <Layout>
                  <Search />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/communities" element={
              <ProtectedRoute>
                <Layout>
                  <Communities />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;