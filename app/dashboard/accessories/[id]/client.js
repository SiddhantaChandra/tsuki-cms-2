'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import useRBAC from '@/utils/hooks/useRBAC';

export default function AccessoryDetailClient({ params }) {
  const { id } = params;
  const supabase = createClient();
  const router = useRouter();
  const { isAdmin, isEditor } = useRBAC();

  const [accessory, setAccessory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchAccessory = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('accessories')
          .select(`
            *,
            categories:category_id (
              id,
              name
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (!data) {
          throw new Error('Accessory not found');
        }

        setAccessory(data);
        if (data.image_urls && data.image_urls.length > 0) {
          setSelectedImage(data.image_urls[0]);
        } else {
          setSelectedImage(data.thumbnail_url);
        }
      } catch (error) {
        console.error('Error fetching accessory:', error);
        setError('Failed to load accessory details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAccessory();
    }
  }, [id, supabase]);

  const handleBackClick = () => {
    router.push('/dashboard/accessories');
  };

  const handleEditClick = () => {
    router.push(`/dashboard/accessories/${id}/edit`);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{ mt: 2 }}
        >
          Back to Accessories
        </Button>
      </Container>
    );
  }

  if (!accessory) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning" sx={{ mt: 4 }}>Accessory not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{ mt: 2 }}
        >
          Back to Accessories
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
        >
          Back to Accessories
        </Button>
        
        {(!loading && (isAdmin?.() || isEditor?.())) && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
          >
            Edit Accessory
          </Button>
        )}
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Image Gallery */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <img
                src={selectedImage || '/images/placeholder.png'}
                alt={accessory.name}
                style={{ 
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px'
                }}
              />
            </Box>
            
            {accessory.image_urls && accessory.image_urls.length > 1 && (
              <ImageList cols={4} rowHeight={80} sx={{ mt: 1 }}>
                {accessory.image_urls.map((img, index) => (
                  <ImageListItem 
                    key={index}
                    onClick={() => handleImageClick(img)}
                    sx={{ 
                      cursor: 'pointer',
                      border: img === selectedImage ? '2px solid #2196f3' : 'none',
                      borderRadius: '4px'
                    }}
                  >
                    <img
                      src={img}
                      alt={`${accessory.name} view ${index + 1}`}
                      loading="lazy"
                      style={{ 
                        height: '100%',
                        objectFit: 'contain',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '2px'
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Grid>

          {/* Accessory Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {accessory.name}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip 
                label={accessory.accessory_type || 'Other'}
                color="secondary"
                variant="outlined"
              />
              {accessory.categories && (
                <Chip 
                  label={accessory.categories.name}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
            
            <Typography variant="h5" component="p" color="primary" sx={{ mb: 2 }}>
              ${accessory.price?.toFixed(2)}
            </Typography>
            
            <Chip
              label={accessory.stock_quantity > 0 ? `In Stock: ${accessory.stock_quantity}` : 'Out of Stock'}
              color={accessory.stock_quantity > 0 ? 'success' : 'error'}
              sx={{ mb: 3 }}
            />
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            
            <Typography variant="body1" paragraph>
              {accessory.description || 'No description provided.'}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Product ID: {accessory.id}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Added: {new Date(accessory.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
} 