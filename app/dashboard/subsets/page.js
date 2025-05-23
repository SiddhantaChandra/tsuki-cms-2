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
  Drawer
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import CategoryIcon from '@mui/icons-material/Category';
import CollectionsIcon from '@mui/icons-material/Collections';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export default function ManageSubsetsPage() {
  const supabase = createClient();

  const [subsetName, setSubsetName] = useState('');
  const [selectedSetForForm, setSelectedSetForForm] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  
  const [sets, setAllSets] = useState([]);
  const [allSubsets, setAllSubsets] = useState([]);
  const [filteredSubsets, setFilteredSubsets] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingAllSets, setLoadingAllSets] = useState(true);
  const [loadingSubsets, setLoadingSubsets] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showNewSubsetForm, setShowNewSubsetForm] = useState(false);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    set: '',
    sortBy: 'name_asc'
  });

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subsetToDelete, setSubsetToDelete] = useState(null);

  const fetchAllSets = useCallback(async () => {
    setLoadingAllSets(true);
    setError(null);
    
    try {
      // Fetch categories first
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name');
        
      if (categoriesError) throw categoriesError;
      
      // Fetch sets with category information
      const { data: setsData, error: setsError } = await supabase
        .from('sets')
        .select('id, name, category_id, categories (id, name)');
        
      if (setsError) throw setsError;
      
      setAllSets(setsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try refreshing.');
      setAllSets([]);
      setCategories([]);
    } finally {
      setLoadingAllSets(false);
    }
  }, [supabase]);

  const fetchSubsets = useCallback(async (appliedFilters = filters) => {
    setLoadingSubsets(true);
    setError(null);
    
    try {
      // Build query for fetching all subsets without pagination
      let query = supabase.from('subsets').select(`
        id, 
        name, 
        set_id, 
        release_date, 
        created_at,
        sets (id, name, category_id, categories(id, name))
      `);
      
      // Apply set filter
      if (appliedFilters.set) {
        query = query.eq('set_id', appliedFilters.set);
      }
      // If category filter is applied but no set filter, we need to join with sets
      else if (appliedFilters.category) {
        // For count query we need to join with sets
        const { data: setIds, error: setIdsError } = await supabase
          .from('sets')
          .select('id')
          .eq('category_id', appliedFilters.category);
          
        if (setIdsError) throw setIdsError;
        
        if (setIds && setIds.length > 0) {
          const setIdArray = setIds.map(set => set.id);
          query = query.in('set_id', setIdArray);
        } else {
          // No sets in this category, return empty result
          setAllSubsets([]);
          setFilteredSubsets([]);
          setLoadingSubsets(false);
          return;
        }
      }
      
      // Apply sorting
      switch (appliedFilters.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'release_newest':
          query = query.order('release_date', { ascending: false });
          break;
        case 'release_oldest':
          query = query.order('release_date', { ascending: true });
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
      
      // Execute query to get all results
      const { data, error: subsetsError } = await query;
      
      if (subsetsError) throw subsetsError;
      
      setAllSubsets(data || []);
      applySearch(data || [], searchQuery);
    } catch (error) {
      console.error('Error fetching subsets:', error);
      setError('Failed to load subsets. Please try refreshing.');
      setAllSubsets([]);
      setFilteredSubsets([]);
    } finally {
      setLoadingSubsets(false);
    }
  }, [supabase, filters, searchQuery]);

  useEffect(() => {
    // Ensure the release_date column exists in the subsets table
    const ensureReleaseDateColumn = async () => {
      try {
        // Use the RPC function to ensure the column exists
        const { data, error } = await supabase.rpc('add_release_date_to_subsets');
        if (error) {
          console.error('Error ensuring release_date column:', error);
        }
      } catch (err) {
        console.error('Failed to ensure release_date column:', err);
      }
    };
    
    ensureReleaseDateColumn();
    fetchAllSets();
    fetchSubsets();
  }, [fetchAllSets, fetchSubsets, supabase]);

  // Search handler
  const applySearch = (subsetsData, query) => {
    if (!query.trim()) {
      setFilteredSubsets(subsetsData);
      return;
    }
    
    const filtered = subsetsData.filter(subset => 
      subset.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredSubsets(filtered);
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    applySearch(allSubsets, query);
  };
  
  // Filter handler
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchSubsets(newFilters);
    setFilterDrawerOpen(false);
  };

  const handleRefresh = () => {
    fetchSubsets();
    fetchAllSets();
  };

  const handleDownloadCSV = () => {
    if (filteredSubsets.length === 0) return;
    
    const csvContent = [
      ['Name', 'Set', 'Category', 'Release Date'],
      ...filteredSubsets.map(subset => [
        subset.name,
        subset.sets?.name || 'N/A',
        subset.sets?.categories?.name || 'N/A',
        subset.release_date ? new Date(subset.release_date).toLocaleDateString() : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subsets.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  // When category changes, filter available sets
  const getFilteredSetOptions = () => {
    if (!filters.category) return sets;
    return sets.filter(set => set.category_id === filters.category);
  };

  const handleAddSubset = async (event) => {
    event.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setSuccessMessage(null);

    if (!subsetName.trim()) {
      setFormError('Subset Name is required.');
      setFormLoading(false);
      return;
    }
    if (!selectedSetForForm) {
      setFormError('Parent Set is required.');
      setFormLoading(false);
      return;
    }

    try {
      const trimmedSubsetName = subsetName.trim();
      const baseSlug = slugify(trimmedSubsetName, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
      const uniqueId = uuidv4().substring(0, 8);
      const finalSlug = `${baseSlug}-${uniqueId}`;

      const { error: insertError } = await supabase
        .from('subsets')
        .insert([{ 
          name: trimmedSubsetName, 
          set_id: selectedSetForForm, 
          slug: finalSlug,
          release_date: releaseDate || null
        }]);

      if (insertError) throw insertError;

      setSuccessMessage('Subset added successfully!');
      setSubsetName('');
      setSelectedSetForForm('');
      setReleaseDate('');
      fetchSubsets(filters);
      setShowNewSubsetForm(false);
    } catch (err) {
      console.error('Error adding subset:', err);
      setFormError('Failed to add subset: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleDeleteSubset = async () => {
    if (!subsetToDelete) return;
    
    setFormLoading(true); 
    setError(null);
    setSuccessMessage(null);
    try {
      const { error } = await supabase.from('subsets').delete().match({ id: subsetToDelete.id });
      if (error) throw error;
      setSuccessMessage('Subset deleted successfully.');
      fetchSubsets(filters);
    } catch (err) {
      console.error('Error deleting subset:', err);
      setError('Failed to delete subset: ' + err.message);
    } finally {
      setFormLoading(false);
      setDeleteDialogOpen(false);
      setSubsetToDelete(null);
    }
  };

  const openDeleteDialog = (subset) => {
    setSubsetToDelete(subset);
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
              Subsets
            </Typography>
            <Chip
              icon={<ViewModuleIcon />}
              label={`Total Subsets: ${filteredSubsets.length}`}
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
              disabled={filteredSubsets.length === 0}
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
              onClick={() => setShowNewSubsetForm(!showNewSubsetForm)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              {showNewSubsetForm ? 'Hide Form' : 'Add New Subset'}
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

      {/* New Subset Form */}
      <AnimatePresence>
        {showNewSubsetForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <ViewModuleIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Add New Subset
                </Typography>
              </Stack>
              
              {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>
              )}
              
              <Box component="form" onSubmit={handleAddSubset} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Subset Name"
                value={subsetName}
                onChange={(e) => setSubsetName(e.target.value)}
                required
                disabled={formLoading}
              />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth required>
                      <InputLabel>Parent Set</InputLabel>
                      <Select
                value={selectedSetForForm}
                onChange={(e) => setSelectedSetForForm(e.target.value)}
                        label="Parent Set"
                disabled={formLoading || loadingAllSets}
              >
                {getFilteredSetOptions().map((set) => (
                          <MenuItem key={set.id} value={set.id}>{set.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Release Date"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                disabled={formLoading}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => setShowNewSubsetForm(false)}
                disabled={formLoading}
              >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={formLoading}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                      }
                    }}
                  >
                    {formLoading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Adding...
                      </>
                    ) : (
                      'Add Subset'
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
            placeholder="Search subsets..."
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

      {/* Subsets List */}
      {loadingSubsets ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ ml: 2 }}>Loading subsets...</Typography>
        </Box>
      ) : (
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {filteredSubsets.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <ViewModuleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No subsets found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery ? 'Try different search terms or' : 'Add some subsets to get started or'} adjust your filters.
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredSubsets.map((subset, index) => (
                <React.Fragment key={subset.id}>
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
                          {subset.name}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                      {subset.sets && (
                            <Chip
                              icon={<CollectionsIcon />}
                              label={subset.sets.name}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                      )}
                      {subset.sets?.categories && (
                            <Chip
                              icon={<CategoryIcon />}
                              label={subset.sets.categories.name}
                              size="small"
                              variant="outlined"
                              color="secondary"
                            />
                      )}
                      {subset.release_date && (
                            <Chip
                              label={`Released: ${new Date(subset.release_date).toLocaleDateString()}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      }
                    />
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        color="error"
                        onClick={() => openDeleteDialog(subset)}
                      disabled={formLoading}
                    >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </ListItem>
                  {index < filteredSubsets.length - 1 && <Divider />}
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
            Filter Subsets
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
              <InputLabel>Set</InputLabel>
              <Select
                value={filters.set}
                onChange={(e) => setFilters({ ...filters, set: e.target.value })}
                label="Set"
              >
                <MenuItem value="">All Sets</MenuItem>
                {getFilteredSetOptions().map((set) => (
                  <MenuItem key={set.id} value={set.id}>{set.name}</MenuItem>
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
                <MenuItem value="release_newest">Release Date (Newest)</MenuItem>
                <MenuItem value="release_oldest">Release Date (Oldest)</MenuItem>
              </Select>
            </FormControl>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setFilters({ category: '', set: '', sortBy: 'name_asc' });
                  handleFilter({ category: '', set: '', sortBy: 'name_asc' });
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
            Are you sure you want to delete the subset "{subsetToDelete?.name}"? This might affect existing cards.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteSubset} 
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