import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { documentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const NewVerifyDocument: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setVerifyResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  const handleVerify = async () => {
    if (!file) return;

    setVerifying(true);
    try {
      const response = await documentAPI.verify(file);
      setVerifyResult(response.data);
      
      if (response.data.verified) {
        toast.success('Document verified! ✅');
      } else {
        toast.error('Document not found in blockchain');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setVerifyResult(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes checkmark {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        .verify-area {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .verify-area:hover {
          transform: scale(1.02);
        }
      `}</style>

      <div style={{ animation: 'slideUp 0.5s ease-out' }}>
        {!verifyResult ? (
          <>
            {/* Drop Zone */}
            <div
              {...getRootProps()}
              className="verify-area"
              style={{
                border: `2px dashed ${isDragActive ? '#10b981' : 'rgba(16, 185, 129, 0.3)'}`,
                borderRadius: '16px',
                padding: '60px 40px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragActive 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
                  : 'rgba(17, 24, 39, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <input {...getInputProps()} />
              
              {/* Animated Background */}
              {isDragActive && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.2), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite'
                }}></div>
              )}

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Shield Icon */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 24px',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isDragActive ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.3s'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={isDragActive ? '#10b981' : '#6b7280'} strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>

                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '8px'
                }}>
                  {isDragActive ? 'Drop to verify!' : 'Verify Document Authenticity'}
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>
                  Upload a document to check if it exists in the blockchain
                </p>
                <p style={{ color: '#6b7280', fontSize: '12px' }}>
                  We'll compare its hash with blockchain records
                </p>
              </div>
            </div>

            {/* Selected File */}
            {file && !verifying && (
              <div style={{
                marginTop: '24px',
                background: 'rgba(17, 24, 39, 0.6)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                animation: 'slideUp 0.3s ease-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  {/* File Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>

                  {/* File Info */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                      {file.name}
                    </h4>
                    <p style={{ fontSize: '13px', color: '#9ca3af' }}>
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={handleReset}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      color: '#ef4444',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                  >
                    Remove
                  </button>
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerify}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Verify Authenticity
                </button>
              </div>
            )}

            {/* Verifying State */}
            {verifying && (
              <div style={{
                marginTop: '24px',
                background: 'rgba(17, 24, 39, 0.6)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                animation: 'slideUp 0.3s ease-out'
              }}>
                {/* Verification Animation */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 20px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    border: '4px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '50%'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    border: '4px solid transparent',
                    borderTopColor: '#10b981',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    inset: '8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                  Verifying Document...
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                  Checking blockchain records
                </p>
              </div>
            )}
          </>
        ) : (
          /* Verification Result */
          <div style={{
            background: verifyResult.verified 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))'
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
            border: `1px solid ${verifyResult.verified ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            animation: verifyResult.verified ? 'slideUp 0.5s ease-out' : 'shake 0.5s ease-out'
          }}>
            {/* Result Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              background: verifyResult.verified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {verifyResult.verified ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" strokeDasharray="100" strokeDashoffset="0" style={{ animation: 'checkmark 0.5s ease-out' }}/>
                </svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              )}
            </div>

            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: verifyResult.verified ? '#10b981' : '#ef4444',
              marginBottom: '12px'
            }}>
              {verifyResult.verified ? 'Document Verified! ✅' : 'Document Not Found ❌'}
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
              {verifyResult.message}
            </p>

            {/* Document Details (if verified) */}
            {verifyResult.verified && (
              <div style={{
                background: 'rgba(17, 24, 39, 0.6)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'left',
                marginBottom: '24px'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Filename
                  </p>
                  <p style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>
                    {verifyResult.filename}
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Uploaded By
                  </p>
                  <p style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>
                    {verifyResult.uploader}
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Uploaded At
                  </p>
                  <p style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>
                    {new Date(verifyResult.uploaded_at).toLocaleString()}
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    File Hash (SHA-256)
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: '#10b981',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    background: 'rgba(16, 185, 129, 0.05)',
                    padding: '8px',
                    borderRadius: '6px'
                  }}>
                    {verifyResult.file_hash}
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Block Hash
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: '#3b82f6',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    background: 'rgba(59, 130, 246, 0.05)',
                    padding: '8px',
                    borderRadius: '6px'
                  }}>
                    {verifyResult.block_hash}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    flex: 1,
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Block #</p>
                    <p style={{ fontSize: '16px', color: '#3b82f6', fontWeight: '700' }}>
                      {verifyResult.block_index}
                    </p>
                  </div>
                  <div style={{
                    flex: 1,
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Status</p>
                    <p style={{ fontSize: '16px', color: '#10b981', fontWeight: '700' }}>
                      Authentic ✓
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Not Found Details */}
            {!verifyResult.verified && (
              <div style={{
                background: 'rgba(17, 24, 39, 0.6)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '24px'
              }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  File Hash
                </p>
                <p style={{
                  fontSize: '13px',
                  color: '#ef4444',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  background: 'rgba(239, 68, 68, 0.05)',
                  padding: '8px',
                  borderRadius: '6px'
                }}>
                  {verifyResult.file_hash}
                </p>
                <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '12px' }}>
                  This document hash was not found in the blockchain. It may not have been uploaded yet.
                </p>
              </div>
            )}

            {/* Verify Another Button */}
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '14px',
                background: verifyResult.verified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: verifyResult.verified ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: verifyResult.verified ? '#10b981' : '#ef4444',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = verifyResult.verified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = verifyResult.verified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Verify Another Document
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NewVerifyDocument;