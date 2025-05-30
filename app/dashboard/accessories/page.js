'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Button, Container, Typography, CircularProgress, Alert, Snackbar,
  TextField, InputAdornment, Chip, Stack, Pagination, FormControl,
  InputLabel, Select, MenuItem, Skeleton, IconButton, Tooltip, Paper,
  ToggleButtonGroup, ToggleButton, Slide, Fade, alpha, useTheme,
  Badge,  Breadcrumbs, Card, CardContent, Grid, Drawer,
   Slider, Divider
} from '@mui/material';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TuneIcon from '@mui/icons-material/Tune';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ClearIcon from '@mui/icons-material/Clear';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useRBAC from '@/utils/hooks/useRBAC';
import { getImageProps } from '@/utils/imageUtils';

const ITEMS_PER_PAGE = 20;

// Motion wrapper for filter drawer
const MotionPaper = motion.create(Paper);

export default function ModernAccessoriesPage() {
  const supabase = createClient();
  const theme = useTheme();
  const router = useRouter();
  const { isAdmin, isEditor } = useRBAC();

  // Data states
  const [accessories, setAccessories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [accessoryTypes, setAccessoryTypes] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [viewMode, setViewMode] = useState('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // Filter and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAccessoryType, setSelectedAccessoryType] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Delete dialog states
  const [accessoryToDelete, setAccessoryToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Stats calculation
  const stats = useMemo(() => {
    if (!accessories.length) return { total: 0, avgPrice: 0, categories: 0 };
    
    const totalPrice = accessories.reduce((sum, accessory) => sum + (accessory.price || 0), 0);
    const uniqueCategories = new Set(accessories.map(accessory => accessory.category_id).filter(Boolean));
    
    return {
      total: totalCount,
      avgPrice: totalPrice / accessories.length,
      categories: uniqueCategories.size
    };
  }, [accessories, totalCount]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch categories and accessory types for filter
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');
        
        if (!categoriesError) {
          setCategories(categoriesData || []);
        }

        // Fetch unique accessory types
        const { data: accessoriesData, error: accessoriesError } = await supabase
        .from('accessories')
        .select('accessory_type')
        .not('accessory_type', 'is', null);

        if (!accessoriesError) {
          const uniqueTypes = [...new Set(accessoriesData.map(item => item.accessory_type).filter(Boolean))];
      setAccessoryTypes(uniqueTypes);
        }
    } catch (error) {
        console.error('Error fetching filter data:', error);
    }
    };
    fetchFilterData();
  }, [supabase]);

  // Main fetch function with filters and pagination
  const fetchAccessories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('accessories')
        .select(`
          id, name, price, thumbnail_url, image_urls, accessory_type, stock_quantity,
          description, slug, categories (id, name)
        `, { count: 'exact' });

      // Apply search filter
      if (debouncedSearchTerm) {
        query = query.ilike('name', `%${debouncedSearchTerm}%`);
      }

      // Apply category filter
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      // Apply accessory type filter
      if (selectedAccessoryType) {
        query = query.eq('accessory_type', selectedAccessoryType);
      }

      // Apply price range filter
      if (priceRange[0] > 0) {
        query = query.gte('price', priceRange[0]);
      }
      if (priceRange[1] < 10000) {
        query = query.lte('price', priceRange[1]);
      }
      
      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        setError('Failed to load accessories: ' + fetchError.message);
        setAccessories([]);
      } else {
      setAccessories(data || []);
        setTotalCount(count || 0);
      }
    } catch (error) {
      setError('Failed to load accessories');
      setAccessories([]);
    } finally {
      setLoading(false);
    }
  }, [supabase, debouncedSearchTerm, selectedCategory, selectedAccessoryType, priceRange, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    fetchAccessories();
  }, [fetchAccessories]);

  const handleAccessoryDeleted = (deletedAccessoryId) => {
    setAccessories(prevAccessories => prevAccessories.filter(accessory => accessory.id !== deletedAccessoryId));
    setTotalCount(prev => prev - 1);
    setNotification({
      open: true,
      message: 'Accessory deleted successfully',
      severity: 'success'
    });
  };

  const handleExport = async () => {
    setNotification({
      open: true,
      message: 'Export feature coming soon!',
      severity: 'info'
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedAccessoryType('');
    setPriceRange([0, 10000]);
    setSortBy('created_at');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    searchTerm,
    selectedCategory,
    selectedAccessoryType,
    priceRange[0] > 0 || priceRange[1] < 10000,
  ].filter(Boolean).length;

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Delete handlers
  const handleDeleteDialogOpen = (accessory) => {
    setAccessoryToDelete(accessory);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setAccessoryToDelete(null);
  };

  const handleDeleteAccessory = async () => {
    if (!accessoryToDelete) return;

    try {
      // Delete from database
      const { error } = await supabase
        .from('accessories')
        .delete()
        .eq('id', accessoryToDelete.id);

      if (error) throw error;

      // Delete from storage if images exist
      if (accessoryToDelete.image_urls && accessoryToDelete.image_urls.length > 0) {
        const imagePaths = accessoryToDelete.image_urls.map(url => {
          const path = url.split('/').slice(-2).join('/');
          return `accessories/${path}`;
        });

        await Promise.all(
          imagePaths.map(path => 
            supabase.storage.from('cardimages').remove([path])
          )
        );
      }

      // Handle thumbnail
      if (accessoryToDelete.thumbnail_url) {
        const thumbPath = accessoryToDelete.thumbnail_url.split('/').slice(-2).join('/');
        await supabase.storage
          .from('cardimages')
          .remove([`accessories/${thumbPath}`]);
      }

      handleAccessoryDeleted(accessoryToDelete.id);
      setNotification({
        open: true,
        message: `Accessory "${accessoryToDelete.name}" deleted successfully.`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting accessory:', error);
      setNotification({
        open: true,
        message: `Failed to delete accessory: ${error.message}`,
        severity: 'error'
      });
    } finally {
      handleDeleteDialogClose();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link href="/dashboard" style={{ color: theme.palette.text.primary, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Dashboard
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingBagIcon sx={{ mr: 0.5 }} fontSize="small" />
          Accessories Collection
        </Typography>
      </Breadcrumbs>

      {/* Header Section */}
      <MotionPaper
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={2}
        sx={{
          p: 4,
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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
          {/* Left side - Title and Stats */}
          <Stack direction="row" alignItems="center" spacing={3}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                m: 0
              }}
            >
              Accessories
            </Typography>
            <Chip 
              icon={<ShoppingBagIcon />}
              label={`${stats.total} Total Accessories`} 
              color="primary" 
              variant="filled"
              sx={{
                fontWeight: 600,
                height: 40,
                '& .MuiChip-icon': { fontSize: 20 }
              }}
            />
          </Stack>

          {/* Right side - Action buttons */}
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center"
          >
            <Tooltip title="Export Collection">
              <IconButton 
                onClick={handleExport} 
                disabled={loading}
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.background.paper, 1),
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton 
                onClick={fetchAccessories} 
                disabled={loading}
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.background.paper, 1),
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            {(isAdmin?.() || isEditor?.()) && (
              <Button 
                component={Link} 
                href="/dashboard/accessories/new" 
                variant="contained" 
                color="primary"
                size="large"
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Add New Accessory
              </Button>
            )}
          </Stack>
        </Stack>
      </MotionPaper>

      {/* Search and Filters Bar */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 3, 
          p: 2, 
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            placeholder="Search accessories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ 
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Badge badgeContent={activeFiltersCount} color="primary">
              <Button
                variant="outlined"
                startIcon={<TuneIcon />}
                onClick={() => setFilterDrawerOpen(true)}
                sx={{ borderRadius: 2 }}
              >
                Filters
              </Button>
            </Badge>
            
            {activeFiltersCount > 0 && (
              <Fade in={true}>
                <Button
                  size="small"
                  onClick={handleClearFilters}
                  sx={{ borderRadius: 2 }}
                >
                  Clear All
                </Button>
              </Fade>
            )}
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              aria-label="view mode"
              size="small"
            >
              <ToggleButton value="table" aria-label="table view">
                <ViewListIcon />
              </ToggleButton>
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModuleIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Paper>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {searchTerm && (
                <Chip
                  label={`Search: ${searchTerm}`}
                  onDelete={() => setSearchTerm('')}
                  size="small"
                />
              )}
              {selectedCategory && (
                <Chip
                  label={`Category: ${categories.find(c => c.id === selectedCategory)?.name}`}
                  onDelete={() => setSelectedCategory('')}
                  size="small"
                />
              )}
              {selectedAccessoryType && (
                <Chip
                  label={`Type: ${selectedAccessoryType}`}
                  onDelete={() => setSelectedAccessoryType('')}
                  size="small"
                />
              )}
              {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                <Chip
                  label={`Price: ₹${priceRange[0]} - ₹${priceRange[1]}`}
                  onDelete={() => setPriceRange([0, 10000])}
                  size="small"
                />
              )}
            </Stack>
          </Box>
        </Slide>
      )}

      {/* Error State */}
      {error && (
        <Fade in={true}>
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={fetchAccessories}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Loading State */}
      {loading ? (
        <Box>
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {[...Array(8)].map((_, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            [...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 1, borderRadius: 1 }} />
            ))
          )}
        </Box>
      ) : (
        <>
          {/* Accessories Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {viewMode === 'grid' ? (
                <Grid container spacing={3}>
                  {accessories.map(accessory => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={accessory.id}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Box sx={{ position: 'relative', paddingTop: '133.33%' }}>
                    {accessory.thumbnail_url ? (
                      <Image
                        src={accessory.thumbnail_url}
                        alt={accessory.name}
                              fill
                              style={{ objectFit: 'contain' }}
                              {...getImageProps({ type: 'card', quality: 80 })}
                      />
                    ) : (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                color: 'text.secondary'
                              }}
                            >
                              No Image
                            </Box>
                          )}
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="h3" noWrap>
                            {accessory.name}
                          </Typography>
                    {accessory.accessory_type && (
                            <Chip 
                              label={accessory.accessory_type} 
                              size="small" 
                              sx={{ mb: 1 }}
                            />
                          )}
                          <Typography variant="h6" color="primary">
                            ₹{accessory.price.toFixed(2)}
                          </Typography>
                  {(isAdmin?.() || isEditor?.()) && (
                            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                              <Button 
                                size="small" 
                                variant="outlined"
                                onClick={() => router.push(`/dashboard/accessories/${accessory.id}/edit`)}
                      >
                        Edit
                              </Button>
                              <Button 
                                size="small" 
                                variant="outlined" 
                                color="error"
                        onClick={() => handleDeleteDialogOpen(accessory)}
                      >
                        Delete
                              </Button>
                            </Stack>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <div>Table view placeholder - AccessoriesTable component needs to be created</div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: { 
            width: 320,
            p: 3,
            borderRadius: '16px 0 0 16px'
          }
        }}
      >
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <ClearIcon />
            </IconButton>
          </Stack>
          
          <Stack spacing={3}>
            {/* Category Filter */}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="">
                  <em>All Categories</em>
                </MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Accessory Type Filter */}
            <FormControl fullWidth>
              <InputLabel>Accessory Type</InputLabel>
              <Select
                value={selectedAccessoryType}
                label="Accessory Type"
                onChange={(e) => {
                  setSelectedAccessoryType(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="">
                  <em>All Types</em>
                </MenuItem>
                {accessoryTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Price Range */}
            <Box>
              <Typography gutterBottom>
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => {
                  setPriceRange(newValue);
                  setCurrentPage(1);
                }}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Sort Options */}
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="created_at">Date Added</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="stock_quantity">Stock</MenuItem>
              </Select>
            </FormControl>

            {/* Sort Order */}
            <FormControl fullWidth>
              <InputLabel>Order</InputLabel>
              <Select
                value={sortOrder}
                label="Order"
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="desc">Descending</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
              </Select>
            </FormControl>

            <Divider />

            {/* Apply/Clear Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
              >
                Clear All
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setFilterDrawerOpen(false)}
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={handleDeleteDialogClose}
        >
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              maxWidth: 400,
              mx: 2
            }}
            onClick={e => e.stopPropagation()}
          >
            <Typography variant="h6" gutterBottom>
              Confirm Delete
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Are you sure you want to delete "{accessoryToDelete?.name}"? This action cannot be undone.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleDeleteDialogClose}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={handleDeleteAccessory}>
                Delete
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          elevation={6}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 