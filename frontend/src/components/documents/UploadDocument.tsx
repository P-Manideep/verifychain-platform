import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import { CloudUpload, CheckCircle, Description } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { documentAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface UploadDocumentProps {
  onUploadSuccess?: () => void;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadResult(null);
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
    try {
      const response = await documentAPI.upload(file);
      setUploadResult(response.data);
      toast.success('Document uploaded and added to blockchain!');
      if (onUploadSuccess) onUploadSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploadResult(null);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Upload Document to Blockchain
      </Typography>

      {!uploadResult ? (
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
                  : 'Drag & drop a file here, or click to select'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported: PDF, Images, Text files
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
                        onClick={handleUpload}
                        disabled={uploading}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        {uploading ? 'Mining Block...' : 'Upload'}
                      </Button>
                    </Box>
                  </Box>

                  {uploading && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Hashing file and mining block... This may take a few seconds.
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* Upload Success */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert
            severity="success"
            icon={<CheckCircle fontSize="large" />}
            sx={{ mb: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              Document Successfully Added to Blockchain!
            </Typography>
            <Typography variant="body2">
              Your document has been hashed and added to block #{uploadResult.block_index}
            </Typography>
          </Alert>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Document Details
            </Typography>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Filename
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {uploadResult.filename}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  File Hash (SHA-256)
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                  {uploadResult.file_hash}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Block Hash
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                  {uploadResult.block_hash}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip label={`Block #${uploadResult.block_index}`} color="primary" />
                <Chip label={`${(uploadResult.file_size / 1024).toFixed(2)} KB`} />
                <Chip label="Verified ✓" color="success" />
              </Box>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleReset}
              sx={{ mt: 3 }}
            >
              Upload Another Document
            </Button>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
};

export default UploadDocument;