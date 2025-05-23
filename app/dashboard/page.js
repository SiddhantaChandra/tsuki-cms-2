'use client'; // Make it a client component

import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, CircularProgress, Alert,
  Paper, Stack, Grid, Divider, Button, useTheme, alpha,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import AddIcon from '@mui/icons-material/Add';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CollectionsIcon from '@mui/icons-material/Collections';
import CategoryIcon from '@mui/icons-material/Category';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Link from 'next/link';

export default function DashboardPage() {
  const supabase = createClient();
  const theme = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState({
    cardCount: 0,
    slabCount: 0,
    accessoryCount: 0,
    totalValue: 0
  });
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch cards data
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('id, name, price, thumbnail_url, created_at');
        
        if (cardsError) throw cardsError;
        
        // Fetch slabs data
        const { data: slabsData, error: slabsError } = await supabase
          .from('slabs')
          .select('id, name, price, thumbnail_url, created_at');
        
        if (slabsError) throw slabsError;
        
        // Fetch accessories data
        const { data: accessoriesData, error: accessoriesError } = await supabase
          .from('accessories')
          .select('id, name, price, thumbnail_url, created_at');
        
        if (accessoriesError) throw accessoriesError;

        // Calculate summary data
        const cardCount = cardsData?.length || 0;
        const slabCount = slabsData?.length || 0;
        const accessoryCount = accessoriesData?.length || 0;
        
        const cardsTotalValue = cardsData?.reduce((sum, card) => sum + (card.price || 0), 0) || 0;
        const slabsTotalValue = slabsData?.reduce((sum, slab) => sum + (slab.price || 0), 0) || 0;
        const accessoriesTotalValue = accessoriesData?.reduce((sum, acc) => sum + (acc.price || 0), 0) || 0;
        const totalValue = cardsTotalValue + slabsTotalValue + accessoriesTotalValue;
        
        setSummaryData({
          cardCount,
          slabCount,
          accessoryCount,
          totalValue
        });
        
        // Prepare recent items data (10 most recent items)
        const allItems = [
          ...(cardsData?.map(item => ({ ...item, type: 'card' })) || []),
          ...(slabsData?.map(item => ({ ...item, type: 'slab' })) || []),
          ...(accessoriesData?.map(item => ({ ...item, type: 'accessory' })) || [])
        ];
        
        // Sort by created_at (newest first) and take the first 10
        const sortedRecentItems = allItems
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10);
          
        setRecentItems(sortedRecentItems);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [supabase]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Greeting Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 3, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
            }
          }}
        >
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
                Good morning, John! 👋
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Here's what's happening with your card collection today.
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                href="/dashboard/cards/new"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Add Card
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                href="/dashboard/slabs/new"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Add Slabs
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </motion.div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ flex: 1, minWidth: '280px' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              height: '100%',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.3s ease'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(20px, -20px)'
              }
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                  Total Inventory Cost
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                  ₹{summaryData.totalValue.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  vs last month
                </Typography>
              </Box>
              <CurrencyRupeeIcon sx={{ fontSize: 32, opacity: 0.7 }} />
            </Stack>
          </Paper>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ flex: 1, minWidth: '280px' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              height: '100%',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.3s ease'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(20px, -20px)'
              }
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                  Total Cards
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                  {summaryData.cardCount.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  in collection
                </Typography>
              </Box>
              <CollectionsIcon sx={{ fontSize: 32, opacity: 0.7 }} />
            </Stack>
          </Paper>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ flex: 1, minWidth: '280px' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #aa4b6b 0%, #6b6b83 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              height: '100%',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.3s ease'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(20px, -20px)'
              }
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                  Total Slabs
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                  {summaryData.slabCount.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  graded cards
                </Typography>
              </Box>
              <CreditCardIcon sx={{ fontSize: 32, opacity: 0.7 }} />
            </Stack>
          </Paper>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ flex: 1, minWidth: '280px' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              height: '100%',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.3s ease'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(20px, -20px)'
              }
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                  Active Users
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                  2,847
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  this week
                </Typography>
              </Box>
              <AccessibilityIcon sx={{ fontSize: 32, opacity: 0.7 }} />
            </Stack>
          </Paper>
        </motion.div>
      </Box>

      {/* Quick Actions Section */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CollectionsIcon />}
              component={Link}
              href="/dashboard/cards"
              sx={{ py: 2, borderRadius: 2 }}
            >
              Manage Cards
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CategoryIcon />}
              component={Link}
              href="/dashboard/slabs"
              sx={{ py: 2, borderRadius: 2 }}
            >
              Manage Slabs
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AccessibilityIcon />}
              component={Link}
              href="/dashboard/accessories"
              sx={{ py: 2, borderRadius: 2 }}
            >
              Manage Accessories
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<CategoryIcon />}
              component={Link}
              href="/dashboard/categories"
              sx={{ py: 2, borderRadius: 2 }}
            >
              Manage Categories
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Recently Added Items */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          Recently Added Items
        </Typography>
        {recentItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No recent items found
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Added</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentItems.map((item, index) => (
                  <TableRow 
                    key={`${item.type}-${item.id}`}
                    sx={{ 
                      '&:hover': { backgroundColor: 'action.hover' },
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell>
                      <Avatar
                        src={item.thumbnail_url}
                        alt={item.name}
                        variant="rounded"
                        sx={{ width: 40, height: 40 }}
                      >
                        {item.name.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        color={
                          item.type === 'card' ? 'primary' :
                          item.type === 'slab' ? 'secondary' : 'default'
                        }
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.price ? `₹${item.price.toLocaleString()}` : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(item.created_at).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
} 