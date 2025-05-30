'use client';

import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, IconButton, Tooltip, Checkbox, FormControlLabel, Chip, Avatar,
  Card, CardMedia, CardContent, Grid, Fade, Zoom, alpha, useTheme,
  TablePagination, Menu, MenuItem, Divider, Stack, Badge, Alert, CircularProgress
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

// Add framer-motion wrapper for MUI components
const MotionCard = motion.create(Card);
const MotionTableRow = motion.create(TableRow);

export default function CardsTable({ cards, onCardDeleted, viewMode = 'table' }) {
  const supabase = createClient();
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCard, setDeletingCard] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  if (!cards || cards.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        my: 8,
        p: 4,
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        borderRadius: 2,
        border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`
      }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No cards found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Start by adding your first card to the collection
        </Typography>
        <Button
          component={Link}
          href="/dashboard/cards/new"
          variant="contained"
          startIcon={<LocalOfferIcon />}
        >
          Add First Card
        </Button>
      </Box>
    );
  }

  const handleMenuOpen = (event, card) => {
    setAnchorEl(event.currentTarget);
    setSelectedCard(card);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCard(null);
  };

  const handleDeleteClick = (card) => {
    setDeletingCard(card);
    setDeleteDialogOpen(true);
    setDeleteError(null);
    setForceDelete(false);
    handleMenuClose();
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeletingCard(null);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCard) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      // Skip image deletion if force delete is selected
      if (!forceDelete) {
        // Delete images from storage
        if (deletingCard.image_urls && deletingCard.image_urls.length > 0) {
          for (const imageUrl of deletingCard.image_urls) {
            try {
              const pathMatch = imageUrl.match(/\/storage\/v1\/object\/public\/cardimages\/(.*)/);
              if (pathMatch && pathMatch[1]) {
                const filePath = pathMatch[1];
                await supabase.storage.from('cardimages').remove([filePath]);
              }
            } catch (imgErr) {
              console.error('Error processing image deletion:', imgErr);
            }
          }
        }
        
        // Delete thumbnail
        if (deletingCard.thumbnail_url) {
          try {
            const pathMatch = deletingCard.thumbnail_url.match(/\/storage\/v1\/object\/public\/cardimages\/(.*)/);
            if (pathMatch && pathMatch[1]) {
              const filePath = pathMatch[1];
              await supabase.storage.from('cardimages').remove([filePath]);
            }
          } catch (thumbErr) {
            console.error('Error processing thumbnail deletion:', thumbErr);
          }
        }
      }
      
      // Delete the card from the database
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', deletingCard.id);
      
      if (error) throw error;
      
      // Notify parent component
      if (onCardDeleted) {
        onCardDeleted(deletingCard.id);
      }
      
      setDeleteDialogOpen(false);
      setDeletingCard(null);
    } catch (error) {
      console.error('Error deleting card:', error);
      setDeleteError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyId = () => {
    if (selectedCard) {
      navigator.clipboard.writeText(selectedCard.id);
      handleMenuClose();
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Grid View Component
  const GridView = () => (
    <Grid container spacing={3}>
      <AnimatePresence>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: hoveredCard === card.id ? 8 : 2,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 1,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                  opacity: hoveredCard === card.id ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                }
              }}
            >
              <Box sx={{ position: 'relative', paddingTop: '133.33%' }}>
                {card.thumbnail_url || (card.image_urls && card.image_urls[0]) ? (
                  <CardMedia
                    component="img"
                    image={card.thumbnail_url || card.image_urls[0]}
                    alt={card.name}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'grey.200',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      No Image
                    </Typography>
                  </Box>
                )}
                
                {/* Price Badge */}
                <Chip
                  label={formatPrice(card.price)}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: 'blur(8px)',
                    fontWeight: 'bold',
                  }}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Typography
                  variant="subtitle1"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {card.name}
                </Typography>
                
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  {card.categories?.name && (
                    <Chip
                      label={card.categories.name}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  )}
                  {card.sets?.name && (
                    <Chip
                      label={card.sets.name}
                      size="small"
                      sx={{ 
                        fontSize: '0.75rem',
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1)
                      }}
                    />
                  )}
                </Stack>
              </CardContent>

              <Box sx={{ p: 1, pt: 0, display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  href={`/dashboard/cards/${card.id}/edit`}
                  size="small"
                  fullWidth
                  variant="outlined"
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, card)}
                  sx={{ 
                    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                    borderRadius: 1
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </MotionCard>
          </Grid>
        ))}
      </AnimatePresence>
    </Grid>
  );

  // Table View Component
  const TableView = () => (
    <TableContainer 
      component={Paper} 
      elevation={0}
      sx={{ 
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        overflow: 'hidden'
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="cards table">
        <TableHead>
          <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
            <TableCell sx={{ width: '80px', fontWeight: 600 }}>Image</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Set/Subset</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
            <TableCell align="center" sx={{ width: '120px', fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <AnimatePresence>
            {cards.map((card, index) => {
              let displayImageUrl = card.thumbnail_url;
              if (!displayImageUrl && card.image_urls && card.image_urls.length > 0) {
                displayImageUrl = card.image_urls[0];
              }

              return (
                <MotionTableRow
                  key={card.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ backgroundColor: alpha(theme.palette.primary.main, 0.02) }}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ position: 'relative', width: 60, height: 80 }}>
                      {displayImageUrl ? (
                        <Zoom in={true} timeout={300}>
                          <Avatar
                            variant="rounded"
                            src={displayImageUrl}
                            sx={{
                              width: 60,
                              height: 80,
                              boxShadow: 2,
                              transition: 'transform 0.2s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                              }
                            }}
                          />
                        </Zoom>
                      ) : (
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 60,
                            height: 80,
                            backgroundColor: 'grey.200',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            No Image
                          </Typography>
                        </Avatar>
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {card.name}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    {card.categories?.name && (
                      <Chip
                        label={card.categories.name}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          color: theme.palette.primary.main
                        }}
                      />
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Stack direction="column" spacing={0.5}>
                      {card.sets?.name && (
                        <Typography variant="body2" color="text.primary">
                          {card.sets.name}
                        </Typography>
                      )}
                      {card.subsets?.name && (
                        <Typography variant="caption" color="text.secondary">
                          {card.subsets.name}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  
                  <TableCell align="right">
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600,
                        color: theme.palette.success.main
                      }}
                    >
                      {formatPrice(card.price)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit">
                        <IconButton
                          component={Link}
                          href={`/dashboard/cards/${card.id}/edit`}
                          size="small"
                          sx={{
                            color: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1)
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="More Options">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, card)}
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.text.primary, 0.1)
                            }
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </MotionTableRow>
              );
            })}
          </AnimatePresence>
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      {viewMode === 'grid' ? <GridView /> : <TableView />}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 180,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              borderRadius: 1,
              mx: 0.5,
              my: 0.25,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }
          }
        }}
      >
        <MenuItem component={Link} href={`/dashboard/cards/${selectedCard?.id}/edit`}>
          <EditIcon fontSize="small" sx={{ mr: 1.5 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => console.log('View', selectedCard)}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1.5 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleCopyId}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1.5 }} />
          Copy ID
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem 
          onClick={() => handleDeleteClick(selectedCard)}
          sx={{
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.1)
            }
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Enhanced Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        TransitionComponent={Zoom}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar
              sx={{
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main
              }}
            >
              <DeleteIcon />
            </Avatar>
            <Typography variant="h6">Confirm Delete</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to delete <strong>"{deletingCard?.name}"</strong>? 
            This action cannot be undone and will remove all associated images from storage.
          </DialogContentText>
          
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError.message || 'Failed to delete card'}
            </Alert>
          )}
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={forceDelete}
                onChange={(e) => setForceDelete(e.target.checked)}
                color="error"
              />
            }
            label={
              <Typography variant="body2" color="error">
                Force delete (skip image deletion)
              </Typography>
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleDeleteCancel} 
            disabled={isDeleting}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={isDeleting} 
            variant="contained"
            startIcon={isDeleting ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}