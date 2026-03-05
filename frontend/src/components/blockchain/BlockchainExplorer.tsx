import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Collapse,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ExpandMore, Refresh, CheckCircle, Block as BlockIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
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

const BlockchainExplorer: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockchainInfo, setBlockchainInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);

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
    try {
      const response = await blockchainAPI.validate();
      if (response.data.is_valid) {
        toast.success('Blockchain is valid!');
      } else {
        toast.error('Blockchain integrity compromised!');
      }
    } catch (error) {
      toast.error('Validation failed');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Blockchain Explorer
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={loadBlockchain}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Blockchain Stats */}
      {blockchainInfo && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {blockchainInfo.total_blocks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Blocks
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">
                {blockchainInfo.difficulty}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Difficulty
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              {blockchainInfo.is_valid ? (
                <Chip icon={<CheckCircle />} label="Blockchain Valid" color="success" />
              ) : (
                <Chip label="Blockchain Invalid" color="error" />
              )}
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Last validated: Just now
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Blocks List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {blocks.map((block, index) => (
          <motion.div
            key={block.index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              sx={{
                border: block.index === 0 ? '2px solid' : '1px solid',
                borderColor: block.index === 0 ? 'success.main' : 'divider',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BlockIcon color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        Block #{block.index}
                        {block.index === 0 && (
                          <Chip label="Genesis" size="small" color="success" sx={{ ml: 1 }} />
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(block.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() =>
                      setExpandedBlock(expandedBlock === block.index ? null : block.index)
                    }
                    sx={{
                      transform: expandedBlock === block.index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                    }}
                  >
                    <ExpandMore />
                  </IconButton>
                </Box>

                <Collapse in={expandedBlock === block.index}>
                  <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Block Hash
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                        >
                          {block.hash}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Previous Hash
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
                        >
                          {block.previous_hash}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Nonce
                        </Typography>
                        <Typography variant="body2">{block.nonce}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Data
                        </Typography>
                        <Paper sx={{ p: 1, bgcolor: 'grey.100', mt: 1 }}>
                          <pre style={{ margin: 0, fontSize: 12, overflow: 'auto' }}>
                            {JSON.stringify(block.data, null, 2)}
                          </pre>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default BlockchainExplorer;