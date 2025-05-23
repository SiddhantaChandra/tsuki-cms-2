'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import CategoryIcon from '@mui/icons-material/Category';
import CollectionsIcon from '@mui/icons-material/Collections';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export default function ManageSetsPage() {
  const supabase = createClient();

  const [setName, setSetName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sets, setSets] = useState([]);
  const [filteredSets, setFilteredSets] = useState([]);
  
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSets, setLoadingSets] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showNewSetForm, setShowNewSetForm] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'name_asc'
  });

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    setError(null);
    const { data, error: catError } = await supabase.from('categories').select('id, name');
    if (catError) {
      console.error("Error fetching categories:", catError);
      setError('Failed to load categories. Please try refreshing.');
      setCategories([]);
    } else {
      setCategories(data || []);
    }
    setLoadingCategories(false);
  }, [supabase]);

  const fetchSets = useCallback(async (appliedFilters = filters) => {
    setLoadingSets(true);
    setError(null);
    
    try {
      let query = supabase
        .from('sets')
        .select('id, name, category_id, categories (name)');
      
      // Apply category filter if provided
      if (appliedFilters.category) {
        query = query.eq('category_id', appliedFilters.category);
      }
      
      // Apply sorting
      switch (appliedFilters.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'name_asc':
          query = query.order('name', { ascending: true });
          break;
        case 'name_desc':
          query = query.order('name', { ascending: false });
          break;
        default:
          query = query.order('name', { ascending: true });
      }
      
      const { data, error: setsError } = await query;
      
      if (setsError) throw setsError;
      
      setSets(data || []);
      applySearch(data || [], searchQuery);
    } catch (error) {
      console.error("Error fetching sets:", error);
      setError('Failed to load sets. Please try refreshing.');
      setSets([]);
      setFilteredSets([]);
    } finally {
      setLoadingSets(false);
    }
  }, [supabase, filters, searchQuery]);

  useEffect(() => {
    fetchCategories();
    fetchSets();
  }, [fetchCategories, fetchSets]);

  // Search handler
  const applySearch = (setsData, query) => {
    if (!query.trim()) {
      setFilteredSets(setsData);
      return;
    }
    
    const filtered = setsData.filter(set => 
      set.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredSets(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applySearch(sets, query);
  };
  
  // Filter handler
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchSets(newFilters);
    setFilterDrawerOpen(false);
  };

  const handleRefresh = () => {
    fetchSets();
    fetchCategories();
  };

  const handleDownloadCSV = () => {
    if (filteredSets.length === 0) return;
    
    const csvContent = [
      ['Name', 'Category'],
      ...filteredSets.map(set => [
        set.name,
        set.categories?.name || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sets.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setSuccessMessage(null);

    if (!setName.trim()) {
      setFormError('Set Name is required.');
      setFormLoading(false);
      return;
    }
    if (!selectedCategory) {
      setFormError('Category is required.');
      setFormLoading(false);
      return;
    }

    try {
      const trimmedSetName = setName.trim();
      const baseSlug = slugify(trimmedSetName, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
      const uniqueId = uuidv4().substring(0, 8);
      const finalSlug = `${baseSlug}-${uniqueId}`;

      const { error: insertError } = await supabase
        .from('sets')
        .insert([{ 
          name: trimmedSetName, 
          category_id: selectedCategory, 
          slug: finalSlug 
        }]);

      if (insertError) {
        throw insertError;
      }

      setSuccessMessage('Set added successfully!');
      setSetName('');
      setSelectedCategory('');
      fetchSets();
      setShowNewSetForm(false);
    } catch (err) {
      console.error('Error adding set:', err);
      setFormError('Failed to add set: ' + (err.message || 'Unknown error'));
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleDeleteSet = async () => {
    if (!setToDelete) return;
    
    setFormLoading(true);
    setError(null); 
    setSuccessMessage(null);
    try {
        const { error: deleteError } = await supabase.from('sets').delete().match({ id: setToDelete.id });
        if (deleteError) throw deleteError;
        setSuccessMessage('Set deleted successfully.');
        fetchSets();
    } catch (err) {
        console.error('Error deleting set:', err);
        setError('Failed to delete set: ' + err.message);
    } finally {
        setFormLoading(false);
        setDeleteDialogOpen(false);
        setSetToDelete(null);
    }
  };

  const openDeleteDialog = (set) => {
    setSetToDelete(set);
    setDeleteDialogOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'primary.main'
        }}
      >
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Sets
            </Typography>
            <Chip
              icon={<CollectionsIcon />}
              label={`Total Sets: ${filteredSets.length}`}
              variant="filled"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 'bold',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadCSV}
              disabled={filteredSets.length === 0}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              Download CSV
            </Button>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowNewSetForm(!showNewSetForm)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              {showNewSetForm ? 'Hide Form' : 'Add New Set'}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          </motion.div>
        )}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* New Set Form */}
      <AnimatePresence>
      {showNewSetForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <CollectionsIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Add New Set
                </Typography>
              </Stack>
              
              {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Set Name"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                required
                disabled={formLoading || loadingCategories}
              />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Category</InputLabel>
                      <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                        label="Category"
                disabled={formLoading || loadingCategories}
              >
                {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => setShowNewSetForm(false)}
                    disabled={formLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                type="submit"
                    variant="contained"
                disabled={formLoading || loadingCategories || loadingSets}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                      }
                    }}
                  >
                    {formLoading && !loadingCategories && !loadingSets ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Adding...
                      </>
                    ) : (
                      'Add Set'
                    )}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filter Bar */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="Search sets..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDrawerOpen(true)}
          >
            Filters
          </Button>
        </Stack>
      </Paper>

      {/* Sets List */}
      {loadingSets ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ ml: 2 }}>Loading sets...</Typography>
        </Box>
      ) : (
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {filteredSets.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CollectionsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No sets found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery ? 'Try different search terms or' : 'Add some sets to get started or'} adjust your filters.
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredSets.map((set, index) => (
                <React.Fragment key={set.id}>
                  <ListItem
                    sx={{
                      py: 2,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight="medium">
                          {set.name}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {set.categories && (
                            <Chip
                              icon={<CategoryIcon />}
                              label={set.categories.name}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          )}
                        </Stack>
                      }
                    />
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        color="error"
                        onClick={() => openDeleteDialog(set)}
                    disabled={formLoading}
                  >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </ListItem>
                  {index < filteredSets.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      )}

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filter Sets
          </Typography>
          
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                label="Sort By"
              >
                <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setFilters({ category: '', sortBy: 'name_asc' });
                  handleFilter({ category: '', sortBy: 'name_asc' });
                }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleFilter(filters)}
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the set "{setToDelete?.name}"? This might affect existing cards.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteSet} 
            color="error" 
            variant="contained"
            disabled={formLoading}
          >
            {formLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 