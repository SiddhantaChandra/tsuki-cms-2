'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Container, Typography, CircularProgress, Alert, Snackbar,
  TextField, InputAdornment, Chip, Stack, Pagination, FormControl,
  InputLabel, Select, MenuItem, Skeleton, IconButton, Paper,
  ToggleButtonGroup, ToggleButton, Slide, Fade, useTheme,
  Badge, Breadcrumbs, Drawer, Slider, Divider, Grid
} from '@mui/material';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import CardsTable from '@/components/Cards/CardsTable';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TuneIcon from '@mui/icons-material/Tune';
import HomeIcon from '@mui/icons-material/Home';
import CollectionsIcon from '@mui/icons-material/Collections';
import ClearIcon from '@mui/icons-material/Clear';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 20;

export default function ModernCardsPage() {
  const supabase = createClient();
  const theme = useTheme();
  
  // Data states
  const [cards, setCards] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [viewMode, setViewMode] = useState('table');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // Filter and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (!error) {
        setCategories(data || []);
      }
    };
    fetchCategories();
  }, [supabase]);

  // Main fetch function with filters and pagination
  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('cards')
        .select(`
          id, name, price, thumbnail_url, image_urls, 
          sets (name), subsets (name), categories (id, name)
        `, { count: 'exact' });

      // Apply search filter
      if (debouncedSearchTerm) {
        query = query.ilike('name', `%${debouncedSearchTerm}%`);
      }

      // Apply category filter
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
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
        setError('Failed to load cards: ' + fetchError.message);
        setCards([]);
      } else {
        setCards(data || []);
        setTotalCount(count || 0);
      }
    } catch (error) {
      setError('Failed to load cards');
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [supabase, debouncedSearchTerm, selectedCategory, priceRange, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleCardDeleted = (deletedCardId) => {
    setCards(prevCards => prevCards.filter(card => card.id !== deletedCardId));
    setTotalCount(prev => prev - 1);
    setNotification({
      open: true,
      message: 'Card deleted successfully',
      severity: 'success'
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setSortBy('created_at');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    searchTerm,
    selectedCategory,
    priceRange[0] > 0 || priceRange[1] < 10000,
  ].filter(Boolean).length;

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link href="/dashboard" style={{ color: theme.palette.text.primary, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Dashboard
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <CollectionsIcon sx={{ mr: 0.5 }} fontSize="small" />
          Cards Collection
        </Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Cards Collection
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your trading cards collection
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/dashboard/cards/new"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: 2,
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: 4,
              },
              transition: 'all 0.2s ease'
            }}
          >
            Add New Card
          </Button>
        </Stack>
      </Paper>

      {/* Search and Filters Bar */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 3, 
          p: 2, 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            placeholder="Search cards..."
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
              <Button color="inherit" size="small" onClick={fetchCards}>
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
          {/* Cards Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <CardsTable 
                cards={cards} 
                onCardDeleted={handleCardDeleted} 
                viewMode={viewMode}
              />
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