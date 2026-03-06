import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const NewLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .input-glow:focus {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#000',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(17, 24, 39, 0.8) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        }}></div>

        {/* Grid Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.4
        }}></div>

        {/* Floating Orbs */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite'
        }}></div>

        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite'
        }}></div>

        {/* Main Card */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '460px',
          margin: '0 20px'
        }}>
          {/* Glow Effect */}
          <div style={{
            position: 'absolute',
            inset: '-2px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
            borderRadius: '24px',
            opacity: 0.5,
            filter: 'blur(20px)',
            zIndex: -1
          }}></div>

          <div style={{
            background: 'rgba(17, 24, 39, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '48px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Logo & Icon */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '32px'
            }}>
              <div style={{
                position: 'relative'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
                  transform: 'rotate(45deg)'
                }}>
                  <svg style={{ transform: 'rotate(-45deg)' }} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                {/* Pulse Ring */}
                <div style={{
                  position: 'absolute',
                  inset: '-8px',
                  border: '2px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '24px',
                  animation: 'pulse 2s ease-in-out infinite'
                }}></div>
              </div>
            </div>

            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{
                fontSize: '36px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #fff 0%, #3b82f6 50%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px',
                letterSpacing: '-0.5px'
              }}>
                VerifyChain
              </h1>
              <p style={{
                color: '#9ca3af',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                Enterprise Blockchain Platform
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: focusedField === 'username' ? '#3b82f6' : '#e5e7eb',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'color 0.3s'
                }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your username"
                    className="input-glow"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: 'rgba(31, 41, 55, 0.5)',
                      border: `2px solid ${focusedField === 'username' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.3s',
                      fontWeight: '500'
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  color: focusedField === 'password' ? '#3b82f6' : '#e5e7eb',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'color 0.3s'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    className="input-glow"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      paddingRight: '56px',
                      background: 'rgba(31, 41, 55, 0.5)',
                      border: `2px solid ${focusedField === 'password' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.3s',
                      fontWeight: '500'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '20px',
                      padding: '4px',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: loading ? 'rgba(107, 114, 128, 0.5)' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: loading ? 'none' : '0 10px 30px rgba(59, 130, 246, 0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <span style={{
                      width: '18px',
                      height: '18px',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.6s linear infinite'
                    }}></span>
                    Signing In...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Footer */}
            <div style={{
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <p style={{
                color: '#9ca3af',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Don't have an account?{' '}
                <span style={{
                  color: '#3b82f6',
                  cursor: 'not-allowed',
                  opacity: 0.6,
                  fontWeight: '600'
                }}>
                  Sign up soon
                </span>
              </p>
            </div>

            {/* Security Badge */}
            <div style={{
              marginTop: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#6b7280',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              256-bit Encrypted Connection
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewLogin;