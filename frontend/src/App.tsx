import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './components/common/ThemeProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NewLogin from './pages/NewLogin';
import NewDashboard from './pages/NewDashboard';
import NewRegister from './pages/NewRegister';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(59, 130, 246, 0.3)',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="verifychain-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<NewLogin />} />
            <Route path="/register" element={<NewRegister />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <NewDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600'
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff'
              }
            }
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;