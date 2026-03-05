import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Chip,
  Button,
} from '@mui/material';
import { CloudUpload, CheckCircle, Cancel, Description } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { documentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const VerifyDocument: React.FC = () => {
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
        toast.success('Document verified successfully!');
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

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Verify Document Authenticity
      </Typography>

      {!verifyResult ? (
        <>
          {/* Dropzone */}
          <Paper
            {...getRootProps()}
            sx={{
              p: 4,
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
          >
            <input {...getInputProps()} />
            <Box sx={{ textAlign: 'center' }}>
              <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {isDragActive
                  ? 'Drop the file here...'
                  : 'Drag & drop a file to verify'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload a document to check if it exists in the blockchain
              </Typography>
            </Box>
          </Paper>

          {/* Selected File */}
          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Paper sx={{ mt: 3, p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Description color="primary" />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {file.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(file.size / 1024).toFixed(2)} KB
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="outlined" onClick={handleReset}>
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleVerify}
                        disabled={verifying}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        {verifying ? 'Verifying...' : 'Verify'}
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* Verification Result */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert
            severity={verifyResult.verified ? 'success' : 'error'}
            icon={verifyResult.verified ? <CheckCircle fontSize="large" /> : <Cancel fontSize="large" />}
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              {verifyResult.verified ? 'Document Verified ✓' : 'Document Not Found ✗'}
            </Typography>
            <Typography variant="body2">{verifyResult.message}</Typography>
          </Alert>

          {verifyResult.verified && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Verification Details
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Filename
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {verifyResult.filename}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded By
                  </Typography>
                  <Typography variant="body1">{verifyResult.uploader}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded At
                  </Typography>
                  <Typography variant="body1">
                    {new Date(verifyResult.uploaded_at).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    File Hash (SHA-256)
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                    {verifyResult.file_hash}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Block Hash
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                    {verifyResult.block_hash}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip label={`Block #${verifyResult.block_index}`} color="primary" />
                  <Chip label="Authentic" color="success" />
                </Box>
              </Box>
            </Paper>
          )}

          <Button fullWidth variant="outlined" onClick={handleReset} sx={{ mt: 3 }}>
            Verify Another Document
          </Button>
        </motion.div>
      )}
    </Box>
  );
};

export default VerifyDocument;