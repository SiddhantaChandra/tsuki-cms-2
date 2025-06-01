'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Container, Typography, CircularProgress, Alert, useTheme, alpha,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Checkbox, FormControlLabel
} from '@mui/material';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import EditCardForm from '@/components/Cards/EditCardForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

export default function EditCardPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params.id;
  const supabase = createClient();
  const theme = useTheme();
  
  const [card, setCard] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sets, setSets] = useState([]);
  const [subsets, setSubsets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);
  const [deleteErrorDetails, setDeleteErrorDetails] = useState(null);

  // Fetch the card data and categories
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch card data
      const { data: cardData, error: cardError } = await supabase
        .from('cards')
        .select('*')
        .eq('id', cardId)
        .single();

      if (cardError) throw new Error(`Failed to load card: ${cardError.message}`);
      if (!cardData) throw new Error('Card not found');
      
      setCard(cardData);
      
      // Fetch categories for the form
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name');
      
      if (categoriesError) throw new Error(`Failed to load categories: ${categoriesError.message}`);
      setCategories(categoriesData || []);

      // Fetch sets for the form
      const { data: setsData, error: setsError } = await supabase
        .from('sets')
        .select('id, name');
      
      if (setsError) throw new Error(`Failed to load sets: ${setsError.message}`);
      setSets(setsData || []);

      // Fetch subsets for the form
      const { data: subsetsData, error: subsetsError } = await supabase
        .from('subsets')
        .select('id, name, slug');
      
      if (subsetsError) throw new Error(`Failed to load subsets: ${subsetsError.message}`);
      setSubsets(subsetsData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase, cardId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditSuccess = () => {
    router.push('/dashboard/cards');
  };

  const handleDeleteCard = async () => {
    setDeleteLoading(true);
    setDeleteErrorDetails(null);
    try {
      console.log('Starting card deletion process for ID:', cardId);
      
      // Skip image deletion if force delete is selected
      if (!forceDelete) {
        // First, delete images from storage if they exist
        if (card.image_urls && card.image_urls.length > 0) {
          console.log('Attempting to delete', card.image_urls.length, 'images');
          
          for (const imageUrl of card.image_urls) {
            try {
              console.log('Processing image URL:', imageUrl);
              
              // This is the format that works for deletion:
              // Example: https://unbemrwqevcofbsxrohg.supabase.co/storage/v1/object/public/cardimages/cards/2025/05/18/filename.webp
              
              // Extract the path from the URL
              const pathMatch = imageUrl.match(/\/storage\/v1\/object\/public\/cardimages\/(.*)/);
              
              if (pathMatch && pathMatch[1]) {
                const filePath = pathMatch[1];
                console.log('Extracted file path:', filePath);
                
                const { data, error } = await supabase.storage
                  .from('cardimages')
                  .remove([filePath]);
                
                if (error) {
                  console.error('Failed to delete image:', error);
                } else {
                  console.log('Successfully deleted image from storage');
                }
              } else {
                console.log('Could not extract path from URL:', imageUrl);
              }
            } catch (imgErr) {
              console.error('Error processing image deletion:', imgErr);
            }
          }
        }
        
        // Delete thumbnail if it exists using the same approach
        if (card.thumbnail_url) {
          try {
            console.log('Processing thumbnail URL:', card.thumbnail_url);
            
            // Extract the path from the URL
            const pathMatch = card.thumbnail_url.match(/\/storage\/v1\/object\/public\/cardimages\/(.*)/);
            
            if (pathMatch && pathMatch[1]) {
              const filePath = pathMatch[1];
              console.log('Extracted thumbnail path:', filePath);
              
              const { data, error } = await supabase.storage
                .from('cardimages')
                .remove([filePath]);
              
              if (error) {
                console.error('Failed to delete thumbnail:', error);
              } else {
                console.log('Successfully deleted thumbnail from storage');
              }
            } else {
              console.log('Could not extract path from thumbnail URL:', card.thumbnail_url);
            }
          } catch (thumbErr) {
            console.error('Error processing thumbnail deletion:', thumbErr);
          }
        }
      } else {
        console.log('Force delete enabled - skipping image deletion');
      }
      
      // Delete the card from the database
      console.log('Attempting to delete card from database with ID:', cardId);
      const { data, error: deleteError } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId);
      
      console.log('Delete operation response:', { data, error: deleteError });
      
      if (deleteError) {
        console.error('Database deletion error details:', deleteError);
        setDeleteErrorDetails(deleteError);
        throw new Error(`Failed to delete card: ${deleteError.message}`);
      }
      
      console.log('Card successfully deleted from database');
      
      // Close dialog and redirect
      setDeleteDialogOpen(false);
      router.push('/dashboard/cards');
    } catch (err) {
      console.error('Error deleting card:', err);
      setError(`Failed to delete card: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Edit Card
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            component={Link} 
            href="/dashboard/cards" 
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: '#fff',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.6)',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            BACK TO COLLECTION
          </Button>
          <Button 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.8)
              }
            }}
          >
            DELETE
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          py: 5, 
          backgroundColor: 'rgba(30, 30, 30, 0.8)', 
          borderRadius: '8px',
        }}>
          <CircularProgress />
          <Typography sx={{ mt: 2, color: '#fff' }}>Loading card data...</Typography>
        </Box>
      ) : (
        <EditCardForm
          card={card}
          categories={categories}
          sets={sets}
          subsets={subsets}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1E1E1E',
            color: '#fff',
            borderRadius: '8px',
          }
        }}
      >
        <DialogTitle>Delete Card</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to delete this card? This action cannot be undone and will remove all associated images from storage.
          </DialogContentText>
          
          {deleteErrorDetails && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2">Error Code: {deleteErrorDetails.code}</Typography>
              <Typography variant="body2">Message: {deleteErrorDetails.message}</Typography>
              <Typography variant="body2">Details: {deleteErrorDetails.details}</Typography>
              <Typography variant="body2">Hint: {deleteErrorDetails.hint}</Typography>
            </Alert>
          )}
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={forceDelete}
                onChange={(e) => setForceDelete(e.target.checked)}
                sx={{ color: theme.palette.error.main }}
              />
            }
            label="Force delete (skip image deletion)"
            sx={{ mt: 2, color: theme.palette.error.main }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            color="primary"
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteCard} 
            variant="contained" 
            color="error" 
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
            autoFocus
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 