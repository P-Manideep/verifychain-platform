import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { documentAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface UploadDocumentProps {
  onUploadSuccess?: () => void;
}

const NewUploadDocument: React.FC<UploadDocumentProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadResult(null);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await documentAPI.upload(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadResult(response.data);
        toast.success('Document uploaded to blockchain! 🎉');
        if (onUploadSuccess) onUploadSuccess();
      }, 500);
    } catch (error: any) {
      clearInterval(progressInterval);
      toast.error(error.response?.data?.detail || 'Upload failed');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploadResult(null);
    setUploadProgress(0);
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
        @keyframes checkmark {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        .upload-area {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .upload-area:hover {
          transform: scale(1.02);
        }
      `}</style>

      <div style={{ animation: 'slideUp 0.5s ease-out' }}>
        {!uploadResult ? (
          <>
            {/* Drop Zone */}
            <div
              {...getRootProps()}
              className="upload-area"
              style={{
                border: `2px dashed ${isDragActive ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)'}`,
                borderRadius: '16px',
                padding: '60px 40px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragActive 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
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
                  background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite'
                }}></div>
              )}

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Upload Icon */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 24px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isDragActive ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.3s'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={isDragActive ? '#3b82f6' : '#6b7280'} strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>

                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '8px'
                }}>
                  {isDragActive ? 'Drop it here!' : 'Drag & drop your document'}
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>
                  or click to browse files
                </p>
                <p style={{ color: '#6b7280', fontSize: '12px' }}>
                  Supports: PDF, Images, Documents (Max 10MB)
                </p>
              </div>
            </div>

            {/* Selected File */}
            {file && !uploading && (
              <div style={{
                marginTop: '24px',
                background: 'rgba(17, 24, 39, 0.6)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                animation: 'slideUp 0.3s ease-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  {/* File Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
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

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  style={{
                    width: '100%',
                    padding: '14px',
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
                  Upload to Blockchain
                </button>
              </div>
            )}

            {/* Uploading State */}
            {uploading && (
              <div style={{
                marginTop: '24px',
                background: 'rgba(17, 24, 39, 0.6)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                animation: 'slideUp 0.3s ease-out'
              }}>
                {/* Mining Animation */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 20px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    border: '4px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '50%'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    border: '4px solid transparent',
                    borderTopColor: '#3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    inset: '8px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                  </div>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                  Mining Block...
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>
                  Hashing your document and adding to blockchain
                </p>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                    width: `${uploadProgress}%`,
                    transition: 'width 0.3s ease-out',
                    borderRadius: '4px'
                  }}></div>
                </div>
                <p style={{ color: '#6b7280', fontSize: '13px', fontWeight: '600' }}>
                  {uploadProgress}%
                </p>
              </div>
            )}
          </>
        ) : (
          /* Success State */
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            animation: 'slideUp 0.5s ease-out'
          }}>
            {/* Success Checkmark */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" strokeDasharray="100" strokeDashoffset="0" style={{ animation: 'checkmark 0.5s ease-out' }}/>
              </svg>
            </div>

            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '12px' }}>
              Successfully Added to Blockchain! 🎉
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
              Your document has been hashed and added to block #{uploadResult.block_index}
            </p>

            {/* Document Details */}
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
                  {uploadResult.filename}
                </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  File Hash (SHA-256)
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
                  {uploadResult.file_hash}
                </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Block Hash
                </p>
                <p style={{
                  fontSize: '13px',
                  color: '#8b5cf6',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  background: 'rgba(139, 92, 246, 0.05)',
                  padding: '8px',
                  borderRadius: '6px'
                }}>
                  {uploadResult.block_hash}
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
                    {uploadResult.block_index}
                  </p>
                </div>
                <div style={{
                  flex: 1,
                  background: 'rgba(139, 92, 246, 0.1)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Size</p>
                  <p style={{ fontSize: '16px', color: '#8b5cf6', fontWeight: '700' }}>
                    {formatFileSize(uploadResult.file_size)}
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
                    Verified ✓
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Another Button */}
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '14px',
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
              Upload Another Document
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NewUploadDocument;