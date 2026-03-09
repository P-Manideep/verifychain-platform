import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const NewRegister: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await authAPI.register({ username, email, password });
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Registration failed');
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/>
                    <line x1="22" y1="11" x2="16" y2="11"/>
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
                Create Account
              </h1>
              <p style={{
                color: '#9ca3af',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                Join VerifyChain Platform
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
                    placeholder="Choose a username"
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

              {/* Email */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: focusedField === 'email' ? '#3b82f6' : '#e5e7eb',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'color 0.3s'
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="your@email.com"
                    className="input-glow"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: 'rgba(31, 41, 55, 0.5)',
                      border: `2px solid ${focusedField === 'email' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
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
                    placeholder="At least 6 characters"
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
                    Creating Account...
                  </span>
                ) : 'Create Account'}
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
                Already have an account?{' '}
                <span 
                  onClick={() => navigate('/login')}
                  style={{
                    color: '#3b82f6',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Sign in
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
              Your data is secure
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewRegister;