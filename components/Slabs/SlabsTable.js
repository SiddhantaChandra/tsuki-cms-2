'use client';

import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography,
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
  Checkbox, FormControlLabel, IconButton, Tooltip
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { createClient } from '@/utils/supabase/client';
import { getImageProps } from '@/utils/imageUtils';

export default function SlabsTable({ slabs, onSlabDeleted }) {
  const supabase = createClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSlab, setDeletingSlab] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  if (!slabs || slabs.length === 0) {
    return <Typography sx={{ textAlign: 'center', my: 5 }}>No slabs found. Add some!</Typography>;
  }

  const handleDeleteClick = (slab) => {
    setDeletingSlab(slab);
    setDeleteDialogOpen(true);
    setDeleteError(null);
    setForceDelete(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingSlab(null);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSlab) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      // Skip image deletion if force delete is selected
      if (!forceDelete) {
        // Delete the main images from storage
        if (deletingSlab.image_urls && deletingSlab.image_urls.length > 0) {
          console.log('Attempting to delete', deletingSlab.image_urls.length, 'images');
          
          for (const imageUrl of deletingSlab.image_urls) {
            try {
              // Extract the path from the URL
              const pathMatch = imageUrl.match(/\/storage\/v1\/object\/public\/slabimages\/(.*)/);
              
              if (pathMatch && pathMatch[1]) {
                const filePath = pathMatch[1];
                console.log('Extracted file path:', filePath);
                
                const { error } = await supabase.storage
                  .from('slabimages')
                  .remove([filePath]);
                
                if (error) {
                  console.error('Failed to delete image:', error);
                }
              }
            } catch (imgErr) {
              console.error('Error processing image deletion:', imgErr);
            }
          }
        }
        
        // Delete thumbnail if it exists
        if (deletingSlab.thumbnail_url) {
          try {
            const pathMatch = deletingSlab.thumbnail_url.match(/\/storage\/v1\/object\/public\/slabimages\/(.*)/);
            
            if (pathMatch && pathMatch[1]) {
              const filePath = pathMatch[1];
              
              const { error } = await supabase.storage
                .from('slabimages')
                .remove([filePath]);
              
              if (error) {
                console.error('Failed to delete thumbnail:', error);
              }
            }
          } catch (thumbErr) {
            console.error('Error processing thumbnail deletion:', thumbErr);
          }
        }
      }
      
      // Delete the slab from the database
      const { error: deleteError } = await supabase
        .from('slabs')
        .delete()
        .eq('id', deletingSlab.id);
      
      if (deleteError) throw deleteError;
      
      // Close dialog and notify parent component
      setDeleteDialogOpen(false);
      if (onSlabDeleted) onSlabDeleted(deletingSlab.id);
      
    } catch (error) {
      console.error('Error deleting slab:', error);
      setDeleteError(error);
      // We'll keep the dialog open to show the error
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="slabs table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '100px' }}>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Grading Company</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slabs.map((slab) => {
              let displayImageUrl = slab.thumbnail_url;
              if (!displayImageUrl && slab.image_urls && slab.image_urls.length > 0) {
                displayImageUrl = slab.image_urls[0];
              }

              return (
                <TableRow key={slab.id}>
                  <TableCell component="th" scope="row">
                    {displayImageUrl ? (
                      <Image
                        src={displayImageUrl}
                        alt={slab.name || 'Slab image'}
                        {...getImageProps({ type: 'thumbnail' })}
                      />
                    ) : (
                      <Box sx={{ width: 50, height: 70, backgroundColor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                        <Typography variant="caption" color="textSecondary">No Image</Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{slab.name}</TableCell>
                  <TableCell>
                    {slab.grade_companies?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {slab.grade_score}
                  </TableCell>
                  <TableCell align="right">
                    {slab.price !== null && slab.price !== undefined ? `₹${parseFloat(slab.price).toFixed(2)}` : 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Button 
                        component={Link} 
                        href={`/dashboard/slabs/${slab.id}/edit`}
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(slab)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the slab "{deletingSlab?.name}"? This action cannot be undone and will remove all associated images from storage.
          </DialogContentText>
          
          {deleteError && (
            <Typography color="error" sx={{ mt: 2 }}>
              Error: {deleteError.message || 'Failed to delete slab'}
            </Typography>
          )}
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={forceDelete}
                onChange={(e) => setForceDelete(e.target.checked)}
              />
            }
            label="Force delete (skip image deletion)"
            sx={{ mt: 2, color: 'error.main' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={isDeleting} autoFocus>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 