'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useRBAC from '@/utils/hooks/useRBAC';
import EditAccessoryForm from '@/components/Accessories/EditAccessoryForm';

export default function EditAccessoryPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const supabase = createClient();
  const { isAdmin, isEditor } = useRBAC();

  const [accessory, setAccessory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if user has permission to edit
      if (!(isAdmin() || isEditor())) {
        setUnauthorized(true);
        return;
      }

      // Fetch accessory data
      const { data: accessoryData, error: accessoryError } = await supabase
        .from('accessories')
        .select('*')
        .eq('id', id)
        .single();

      if (accessoryError) throw accessoryError;
      
      if (!accessoryData) {
        throw new Error('Accessory not found');
      }
      
      setAccessory(accessoryData);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });

      if (categoriesError) throw categoriesError;
      
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, supabase, isAdmin, isEditor]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBack = () => {
    router.push(`/dashboard/accessories/${id}`);
  };

  if (unauthorized) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          You do not have permission to edit accessory details.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Accessory Details
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Accessory Details
        </Button>
      </Container>
    );
  }

  if (!accessory) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 4 }}>Accessory not found.</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard/accessories')}
          sx={{ mt: 2 }}
        >
          Back to Accessories
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 3 }}>
        <Typography variant="h4" component="h1">
          Edit Accessory
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Cancel
        </Button>
      </Box>
      
      <Paper elevation={3} sx={{ p: 0 }}>
        <EditAccessoryForm
          accessory={accessory}
          categories={categories}
          onSuccess={() => router.push(`/dashboard/accessories/${id}`)}
        />
      </Paper>
    </Container>
  );
} 