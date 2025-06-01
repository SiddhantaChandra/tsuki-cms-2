'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Container, Typography, Alert, CircularProgress,
  Paper
} from '@mui/material';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createClient } from '@/utils/supabase/client';
import EditSlabForm from '@/components/Slabs/EditSlabForm';

export default function EditSlabPage() {
  const router = useRouter();
  const params = useParams();
  const slabId = params.id;
  const supabase = createClient();
  
  const [slab, setSlab] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sets, setSets] = useState([]);
  const [subsets, setSubsets] = useState([]);
  const [gradeCompanies, setGradeCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch the slab and categories data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch the slab data
        const { data: slabData, error: slabError } = await supabase
          .from('slabs')
          .select('*')
          .eq('id', slabId)
          .single();
        
        if (slabError) {
          throw new Error(`Failed to fetch slab: ${slabError.message}`);
        }
        
        if (!slabData) {
          throw new Error('Slab not found');
        }
        
        // Make sure image_urls and thumbnail_url are properly set
        const processedSlabData = {
          ...slabData,
          image_urls: slabData.image_urls || [],
          thumbnail_url: slabData.thumbnail_url || null
        };
        
        setSlab(processedSlabData);
        
        // Fetch all required data in parallel
        const [categoriesResult, setsResult, subsetsResult, gradeCompaniesResult] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('sets').select('*').eq('category_id', slabData.category_id),
          supabase.from('subsets').select('*').eq('set_id', slabData.set_id),
          supabase.from('grade_companies').select('*')
        ]);
        
        if (categoriesResult.error) {
          throw new Error(`Failed to fetch categories: ${categoriesResult.error.message}`);
        }
        
        // Set all the data
        setCategories(categoriesResult.data || []);
        setSets(setsResult.data || []);
        setSubsets(subsetsResult.data || []);
        setGradeCompanies(gradeCompaniesResult.data || []);
        
        // Log the results for debugging
        console.log('Edit Slab Data:', {
          slab: processedSlabData,
          categories: categoriesResult.data?.length,
          sets: setsResult.data?.length,
          subsets: subsetsResult.data?.length,
          gradeCompanies: gradeCompaniesResult.data?.length
        });
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slabId, supabase]);
  
  const handleFormSuccess = () => {
    // Redirect to the slabs list or slab detail page
    router.push('/dashboard/slabs');
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Edit Slab
        </Typography>
        <Button 
          component={Link} 
          href="/dashboard/slabs" 
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back to Slabs
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : (
        <Paper sx={{ p: 3 }}>
          <EditSlabForm
            slab={slab}
            categories={categories}
            sets={sets}
            subsets={subsets}
            gradeCompanies={gradeCompanies}
            onSuccess={handleFormSuccess}
          />
        </Paper>
      )}
    </Container>
  );
} 