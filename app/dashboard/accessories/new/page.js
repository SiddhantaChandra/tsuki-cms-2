'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';
import { createClient } from '@/utils/supabase/client';
import NewAccessoryForm from '@/components/Accessories/NewAccessoryForm'; // Will be created next

export default function NewAccessoryPage() {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);
  const supabase = createClient();

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    setCategoryError(null);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategoryError('Failed to load categories. Please try again.');
    } finally {
      setLoadingCategories(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Add New Accessory
      </Typography>
      {loadingCategories && <CircularProgress />}
      {categoryError && <Alert severity="error" sx={{ mb: 2 }}>{categoryError}</Alert>}
      {!loadingCategories && !categoryError && (
        <NewAccessoryForm categories={categories} />
      )}
    </Container>
  );
} 