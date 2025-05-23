'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Container, Typography, CircularProgress, Alert, Paper,
  Card, CardContent, Breadcrumbs, alpha, useTheme
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import NewSlabForm from '@/components/Slabs/NewSlabForm';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import CollectionsIcon from '@mui/icons-material/Collections';

export default function NewSlabPage() {
  const router = useRouter();
  const supabase = createClient();
  const theme = useTheme();
  const [initialCategories, setInitialCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      const { data, error } = await supabase.from('categories').select('id, name');
      if (error) {
        console.error("Failed to load categories for form:", error);
        setCategoryError('Failed to load categories. Please try refreshing.');
        setInitialCategories([]);
      } else {
        setInitialCategories(data || []);
      }
      setLoadingCategories(false);
    };
    fetchCategories();
  }, [supabase]);

  const handleFormSuccess = () => {
    // Optionally, navigate away or show a persistent success message
    console.log("NewSlabForm submitted successfully from page");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/dashboard" passHref style={{ color: theme.palette.text.primary, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Dashboard
          </Link>
          <Link href="/dashboard/slabs" passHref style={{ color: theme.palette.text.primary, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <CollectionsIcon sx={{ mr: 0.5 }} fontSize="small" />
            Slabs
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <AddCircleIcon sx={{ mr: 0.5 }} fontSize="small" />
            Add New Slab
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Header Area */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 3
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Slab
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => router.push('/dashboard/slabs')}
          sx={{ mb: { xs: 2, sm: 0 } }}
        >
          Back to Collection
        </Button>
      </Box>

      {/* Main Form Card */}
      <Card 
        elevation={3} 
        sx={{ 
          overflow: 'visible',
          borderRadius: 2,
          boxShadow: theme => `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <NewSlabForm
            initialCategories={initialCategories}
            loadingCategoriesExternal={loadingCategories}
            categoryErrorExternal={categoryError}
            onFormSubmitSuccess={handleFormSuccess}
          />
        </CardContent>
      </Card>
    </Container>
  );
} 