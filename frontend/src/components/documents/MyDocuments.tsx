import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { Refresh, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { documentAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface Document {
  id: number;
  filename: string;
  file_hash: string;
  file_size: number;
  block_index: number;
  uploaded_at: string;
  is_verified: boolean;
}

const MyDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await documentAPI.getMyDocuments();
      setDocuments(response.data);
    } catch (error: any) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (documents.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No documents uploaded yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Upload your first document to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          My Documents ({documents.length})
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={loadDocuments}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell><strong>Filename</strong></TableCell>
              <TableCell><strong>Block #</strong></TableCell>
              <TableCell><strong>Size</strong></TableCell>
              <TableCell><strong>Uploaded</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Hash</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc, index) => (
              <motion.tr
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                component={TableRow}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {doc.filename}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={`#${doc.block_index}`} size="small" color="primary" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {(doc.file_size / 1024).toFixed(2)} KB
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  {doc.is_verified ? (
                    <Chip
                      icon={<CheckCircle />}
                      label="Verified"
                      size="small"
                      color="success"
                    />
                  ) : (
                    <Chip label="Pending" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title={doc.file_hash}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        maxWidth: 150,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {doc.file_hash}
                    </Typography>
                  </Tooltip>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyDocuments;