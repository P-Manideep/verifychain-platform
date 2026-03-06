import React, { useState, useEffect } from 'react';
import { blockchainAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface Block {
  index: number;
  timestamp: string;
  data: any;
  previous_hash: string;
  hash: string;
  nonce: number;
}

interface BlockchainInfo {
  total_blocks: number;
  difficulty: number;
  latest_block_hash: string;
  is_valid: boolean;
}

const NewBlockchainExplorer: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    loadBlockchain();
  }, []);

  const loadBlockchain = async () => {
    setLoading(true);
    try {
      const [blocksRes, infoRes] = await Promise.all([
        blockchainAPI.getBlocks(20, 0),
        blockchainAPI.getInfo(),
      ]);

      setBlocks(blocksRes.data);
      setBlockchainInfo(infoRes.data);
    } catch (error: any) {
      toast.error('Failed to load blockchain');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    setValidating(true);
    try {
      const response = await blockchainAPI.validate();
      if (response.data.is_valid) {
        toast.success('Blockchain is valid! ✅');
      } else {
        toast.error('Blockchain integrity compromised!');
      }
    } catch (error) {
      toast.error('Validation failed');
    } finally {
      setValidating(false);
    }
  };

  const toggleBlock = (index: number) => {
    setExpandedBlock(expandedBlock === index ? null : index);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(59, 130, 246, 0.3)',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <p style={{ color: '#9ca3af' }}>Loading blockchain...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .block-card {
          transition: all 0.3s;
        }
        .block-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
        }
      `}</style>

      <div style={{ animation: 'slideUp 0.5s ease-out' }}>
        {/* Blockchain Stats */}
        {blockchainInfo && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Blocks
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6' }}>
                {blockchainInfo.total_blocks}
              </p>
            </div>

            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Difficulty
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#8b5cf6' }}>
                {blockchainInfo.difficulty}
              </p>
            </div>

            <div style={{
              background: blockchainInfo.is_valid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${blockchainInfo.is_valid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Chain Status
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {blockchainInfo.is_valid ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>Valid</p>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444' }}>Invalid</p>
                  </>
                )}
              </div>
            </div>

            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleValidate}
                disabled={validating}
                style={{
                  padding: '10px 20px',
                  background: validating ? 'rgba(107, 114, 128, 0.5)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: validating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => !validating && (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {validating ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite'
                    }}></div>
                    Validating...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="M9 12l2 2 4-4"/>
                    </svg>
                    Validate Chain
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Blocks List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {blocks.map((block, index) => (
            <div
              key={block.index}
              className="block-card"
              style={{
                background: block.index === 0 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))'
                  : 'rgba(17, 24, 39, 0.6)',
                border: block.index === 0 
                  ? '2px solid rgba(16, 185, 129, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                animation: `fadeIn ${0.3 + index * 0.05}s ease-out`
              }}
            >
              {/* Block Header */}
              <div
                onClick={() => toggleBlock(block.index)}
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Block Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: block.index === 0 
                      ? 'rgba(16, 185, 129, 0.2)' 
                      : 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={block.index === 0 ? '#10b981' : '#3b82f6'} strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                  </div>

                  {/* Block Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                        Block #{block.index}
                      </h3>
                      {block.index === 0 && (
                        <span style={{
                          padding: '4px 12px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '6px',
                          color: '#10b981',
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Genesis
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '13px', color: '#9ca3af' }}>
                      {new Date(block.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Expand Icon */}
                <div style={{
                  transform: expandedBlock === block.index ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>

              {/* Block Details (Expandable) */}
              {expandedBlock === block.index && (
                <div style={{
                  padding: '0 20px 20px 20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  animation: 'slideUp 0.3s ease-out'
                }}>
                  <div style={{ paddingTop: '20px' }}>
                    {/* Block Hash */}
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: '600'
                      }}>
                        Block Hash
                      </p>
                      <p style={{
                        fontSize: '13px',
                        color: '#3b82f6',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                        background: 'rgba(59, 130, 246, 0.05)',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(59, 130, 246, 0.1)'
                      }}>
                        {block.hash}
                      </p>
                    </div>

                    {/* Previous Hash */}
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: '600'
                      }}>
                        Previous Hash
                      </p>
                      <p style={{
                        fontSize: '13px',
                        color: '#8b5cf6',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                        background: 'rgba(139, 92, 246, 0.05)',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(139, 92, 246, 0.1)'
                      }}>
                        {block.previous_hash}
                      </p>
                    </div>

                    {/* Nonce & Timestamp */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        background: 'rgba(59, 130, 246, 0.05)',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(59, 130, 246, 0.1)'
                      }}>
                        <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Nonce</p>
                        <p style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6' }}>
                          {block.nonce.toLocaleString()}
                        </p>
                      </div>
                      <div style={{
                        background: 'rgba(139, 92, 246, 0.05)',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(139, 92, 246, 0.1)'
                      }}>
                        <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Timestamp</p>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#8b5cf6' }}>
                          {new Date(block.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Block Data */}
                    <div>
                      <p style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: '600'
                      }}>
                        Block Data
                      </p>
                      <div style={{
                        background: 'rgba(17, 24, 39, 0.8)',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        maxHeight: '300px',
                        overflow: 'auto'
                      }}>
                        <pre style={{
                          margin: 0,
                          fontSize: '12px',
                          color: '#e5e7eb',
                          fontFamily: 'monospace',
                          lineHeight: '1.6'
                        }}>
                          {JSON.stringify(block.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load More Button (if needed) */}
        {blocks.length >= 20 && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              onClick={loadBlockchain}
              style={{
                padding: '12px 32px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '10px',
                color: '#3b82f6',
                fontSize: '14px',
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
              Refresh Blocks
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NewBlockchainExplorer;