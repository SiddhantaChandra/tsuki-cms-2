'use client';

import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryIcon from '@mui/icons-material/Category';
import SaveIcon from '@mui/icons-material/Save';
import { createClient } from '@/utils/supabase/client';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export default function NewCategoryPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!categoryName.trim()) {
      setError('Category name is required.');
      setLoading(false);
      return;
    }

    try {
      const trimmedCategoryName = categoryName.trim();
      const baseSlug = slugify(trimmedCategoryName, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
      const uniqueId = uuidv4().substring(0, 8);
      const finalSlug = `${baseSlug}-${uniqueId}`;

      const { error: insertError } = await supabase
        .from('categories')
        .insert([{ 
          name: trimmedCategoryName, 
          slug: finalSlug 
        }]);

      if (insertError) throw insertError;

      // Redirect back to categories page on success
      router.push('/dashboard/categories');
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category: ' + (err.message || 'Unknown error'));
      setLoading(false);
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
                Add New Category
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
                disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
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
                  {loading ? 'Saving...' : 'Save Category'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Paper>
      </motion.div>
    </Container>
  );
} 