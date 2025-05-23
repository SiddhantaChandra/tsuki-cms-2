'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  Skeleton
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryIcon from '@mui/icons-material/Category';
import SaveIcon from '@mui/icons-material/Save';
import { createClient } from '@/utils/supabase/client';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export default function EditCategoryPage({ params }) {
  const router = useRouter();
  const supabase = createClient();
  const categoryId = params.id;
  
  const [categoryName, setCategoryName] = useState('');
  const [originalCategory, setOriginalCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .single();
          
        if (fetchError) throw fetchError;
        
        if (!data) {
          throw new Error('Category not found');
        }
        
        setOriginalCategory(data);
        setCategoryName(data.name);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategory();
  }, [categoryId, supabase]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    if (!categoryName.trim()) {
      setError('Category name is required.');
      setSaving(false);
      return;
    }

    try {
      const trimmedCategoryName = categoryName.trim();
      
      // Only generate a new slug if the name has changed
      let finalSlug = originalCategory.slug;
      if (trimmedCategoryName !== originalCategory.name) {
        const baseSlug = slugify(trimmedCategoryName, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
        const uniqueId = uuidv4().substring(0, 8);
        finalSlug = `${baseSlug}-${uniqueId}`;
      }

      const { error: updateError } = await supabase
        .from('categories')
        .update({ 
          name: trimmedCategoryName, 
          slug: finalSlug 
        })
        .eq('id', categoryId);

      if (updateError) throw updateError;

      // Redirect back to categories page on success
      router.push('/dashboard/categories');
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category: ' + (err.message || 'Unknown error'));
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/dashboard/categories')}
              variant="outlined"
              size="small"
              sx={{ 
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateX(-2px)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              Back to Categories
            </Button>
            <Divider orientation="vertical" flexItem />
            <Stack direction="row" alignItems="center" spacing={2}>
              <CategoryIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                Edit Category
              </Typography>
            </Stack>
          </Stack>

          {/* Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Form */}
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <CategoryIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Category Information
              </Typography>
            </Stack>

            {loading ? (
              <Stack spacing={3}>
                <Skeleton variant="text" height={60} />
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Skeleton variant="rectangular" width={100} height={40} />
                  <Skeleton variant="rectangular" width={120} height={40} />
                </Stack>
              </Stack>
            ) : (
              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                noValidate 
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              >
                <TextField
                  fullWidth
                  label="Category Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                  disabled={saving}
                  autoFocus
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                  helperText="Enter a unique name for the category"
                />
                
                <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/dashboard/categories')}
                    disabled={saving}
                    sx={{ 
                      borderRadius: 2,
                      px: 3,
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                        transform: 'translateY(-1px)',
                        transition: 'all 0.2s ease-in-out'
                      },
                      '&:disabled': {
                        background: 'rgba(0, 0, 0, 0.12)',
                      }
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Stack>
              </Box>
            )}
          </Paper>
        </Paper>
      </motion.div>
    </Container>
  );
} 