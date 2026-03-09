import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { documentAPI, blockchainAPI } from '../services/api';
import NewUploadDocument from '../components/documents/NewUploadDocument';
import NewVerifyDocument from '../components/documents/NewVerifyDocument';
import NewBlockchainExplorer from '../components/blockchain/NewBlockchainExplorer';

interface Stats {
  totalBlocks: number;
  myDocuments: number;
  verified: number;
}

const NewDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<Stats>({ totalBlocks: 0, myDocuments: 0, verified: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [blockchainInfo, documents] = await Promise.all([
        blockchainAPI.getInfo(),
        documentAPI.getMyDocuments(),
      ]);

      setStats({
        totalBlocks: blockchainInfo.data.total_blocks,
        myDocuments: documents.data.length,
        verified: documents.data.filter((d: any) => d.is_verified).length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .stat-card {
          transition: all 0.3s;
        }
        .stat-card:hover {
          transform: translateY(-4px);
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Top Navigation Bar */}
        <nav style={{
          background: 'rgba(17, 24, 39, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(45deg)'
            }}>
              <svg style={{ transform: 'rotate(-45deg)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #fff, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                VerifyChain
              </h1>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>Enterprise Platform</p>
            </div>
          </div>

          {/* User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <p style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>{user?.username}</p>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Welcome Section */}
          <div style={{ marginBottom: '40px', animation: 'slideDown 0.5s ease-out' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              Welcome back, {user?.username}! 👋
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '16px' }}>
              Here's what's happening with your blockchain today.
            </p>
          </div>

          {/* Stats Cards */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid rgba(59, 130, 246, 0.3)',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'spin 0.8s linear infinite'
              }}></div>
              <p style={{ color: '#6b7280', marginTop: '16px' }}>Loading your data...</p>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '40px',
                animation: 'fadeIn 0.6s ease-out'
              }}>
                {/* Total Blocks Card */}
                <div className="stat-card" style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '16px',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent)',
                    borderRadius: '50%',
                    filter: 'blur(20px)'
                  }}></div>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                    </div>
                    <h3 style={{
                      fontSize: '36px',
                      fontWeight: '700',
                      color: '#3b82f6',
                      marginBottom: '4px'
                    }}>
                      {stats.totalBlocks}
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>
                      Total Blocks
                    </p>
                  </div>
                </div>

                {/* My Documents Card */}
                <div className="stat-card" style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '16px',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent)',
                    borderRadius: '50%',
                    filter: 'blur(20px)'
                  }}></div>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'rgba(139, 92, 246, 0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <h3 style={{
                      fontSize: '36px',
                      fontWeight: '700',
                      color: '#8b5cf6',
                      marginBottom: '4px'
                    }}>
                      {stats.myDocuments}
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>
                      My Documents
                    </p>
                  </div>
                </div>

                {/* Verified Card */}
                <div className="stat-card" style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '16px',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent)',
                    borderRadius: '50%',
                    filter: 'blur(20px)'
                  }}></div>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <h3 style={{
                      fontSize: '36px',
                      fontWeight: '700',
                      color: '#10b981',
                      marginBottom: '4px'
                    }}>
                      {stats.verified}
                    </h3>
                    <p style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>
                      Verified Documents
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Tabs */}
              <div style={{
                background: 'rgba(17, 24, 39, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '32px',
                animation: 'fadeIn 0.8s ease-out'
              }}>
                {/* Tab Navigation */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '32px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingBottom: '16px'
                }}>
                  {['overview', 'upload', 'verify', 'explorer'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '12px 24px',
                        background: activeTab === tab ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        border: activeTab === tab ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                        borderRadius: '8px',
                        color: activeTab === tab ? '#3b82f6' : '#9ca3af',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        textTransform: 'capitalize'
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== tab) {
                          e.currentTarget.style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== tab) {
                          e.currentTarget.style.color = '#9ca3af';
                        }
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === 'overview' && (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
                        Your Blockchain Dashboard
                      </h3>
                      <p style={{ color: '#9ca3af', marginBottom: '32px' }}>
                        Upload, verify, and manage your documents securely on the blockchain.
                      </p>
                      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button
                          onClick={() => setActiveTab('upload')}
                          style={{
                            padding: '14px 32px',
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          Upload Document
                        </button>
                        <button
                          onClick={() => setActiveTab('verify')}
                          style={{
                            padding: '14px 32px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '10px',
                            color: '#3b82f6',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          Verify Document
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'upload' && (
                     <NewUploadDocument onUploadSuccess={loadStats} />
                  )}

                  {activeTab === 'verify' && (
                    <NewVerifyDocument />
                  )}

                  {activeTab === 'explorer' && (
                    <NewBlockchainExplorer />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NewDashboard;