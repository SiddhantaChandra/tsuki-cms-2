'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import {
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Box,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Stack,
  Divider,
  InputAdornment,
  Fade,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CropIcon from '@mui/icons-material/Crop';
import InfoIcon from '@mui/icons-material/Info';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ImageIcon from '@mui/icons-material/Image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import LabelIcon from '@mui/icons-material/Label';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import InventoryIcon from '@mui/icons-material/Inventory';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditAccessoryForm({ accessory, categories, onSuccess }) {
  const supabase = createClient();
  const theme = useTheme();

  const [name, setName] = useState(accessory.name || '');
  const [slug, setSlug] = useState(accessory.slug || '');
  const [description, setDescription] = useState(accessory.description || '');
  const [categoryId, setCategoryId] = useState(accessory.category_id || '');
  const [price, setPrice] = useState(accessory.price?.toString() || '');
  const [stock, setStock] = useState(accessory.stock_quantity?.toString() || '');
  const [accessoryType, setAccessoryType] = useState(accessory.accessory_type || '');
  
  // Images management
  const [existingImages, setExistingImages] = useState(accessory.image_urls || []);
  const [thumbnailUrl, setThumbnailUrl] = useState(accessory.thumbnail_url || '');
  const [newImages, setNewImages] = useState([]);
  const [newThumbnailFile, setNewThumbnailFile] = useState(null);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const [resetImageUploadKey, setResetImageUploadKey] = useState(0);

  // Predefined accessory types
  const accessoryTypes = ['Binder', 'Sleeve', 'Toploader', 'Grading Service', 'Storage Box', 'Display Case', 'Other'];

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required.';
    if (!slug.trim()) errors.slug = 'Slug is required.';
    if (!categoryId) errors.categoryId = 'Category is required.';
    if (!accessoryType) errors.accessoryType = 'Accessory type is required.';
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      errors.price = 'Valid price is required.';
    }
    if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      errors.stock = 'Valid stock quantity is required.';
    }

    // Check if we have either existing images or new images
    if (existingImages.length === 0 && newImages.length === 0) {
      errors.images = 'At least one image is required.';
    }

    // Check if we have either an existing thumbnail or a new one
    if (!thumbnailUrl && !newThumbnailFile) {
      errors.thumbnail = 'Thumbnail image is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUploadComplete = useCallback(({ mainImageFiles, thumbnailImageFile }) => {
    console.log('[EditAccessoryForm] handleImageUploadComplete called', { mainFiles: mainImageFiles?.length, thumbFile: thumbnailImageFile?.name });
    
    if (mainImageFiles && mainImageFiles.length > 0) {
      setNewImages(mainImageFiles);
    }
    
    if (thumbnailImageFile) {
      setNewThumbnailFile(thumbnailImageFile);
    }

    // Clear any image-related errors
    setFormErrors(prev => ({
      ...prev,
      images: null,
      thumbnail: null
    }));
  }, []);

  const handleRemoveExistingImage = (imageToRemove) => {
    setExistingImages(existingImages.filter(img => img !== imageToRemove));
    setImagesToDelete(prev => [...prev, imageToRemove]);
    
    // If removing the current thumbnail, set first available image as thumbnail
    if (imageToRemove === thumbnailUrl) {
      const remainingImages = existingImages.filter(img => img !== imageToRemove);
      if (remainingImages.length > 0) {
        setThumbnailUrl(remainingImages[0]);
      } else {
        setThumbnailUrl('');
      }
    }
  };

  const handleSetAsThumbnail = (image) => {
    setThumbnailUrl(image);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      setSubmitError("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage('');

    try {
      // 1. Handle new thumbnail if provided
      let finalThumbnailUrl = thumbnailUrl;
      
      if (newThumbnailFile) {
        const thumbDatePath = new Date().toISOString().split('T')[0].replace(/-/g, '/');
        const thumbFileName = `thumb_${uuidv4()}_${slugify(newThumbnailFile.name, { lower: true, strict: true })}`;
        const thumbPath = `accessories/${thumbDatePath}/${thumbFileName}`;

        const { error: thumbUploadError } = await supabase.storage
          .from('cardimages')
          .upload(thumbPath, newThumbnailFile);

        if (thumbUploadError) throw new Error(`Thumbnail upload failed: ${thumbUploadError.message}`);
        
        const { data: publicThumbUrlData } = supabase.storage.from('cardimages').getPublicUrl(thumbPath);
        finalThumbnailUrl = publicThumbUrlData.publicUrl;
      }

      // 2. Upload any new images
      const newImageUrls = [];
      if (newImages.length > 0) {
        for (const imageFile of newImages) {
          const datePath = new Date().toISOString().split('T')[0].replace(/-/g, '/');
          const fileName = `${uuidv4()}_${slugify(imageFile.name, { lower: true, strict: true })}`;
          const filePath = `accessories/${datePath}/${fileName}`;

          const { error: imageUploadError } = await supabase.storage
            .from('cardimages')
            .upload(filePath, imageFile);

          if (imageUploadError) throw new Error(`Image upload failed for ${imageFile.name}: ${imageUploadError.message}`);
          
          const { data: publicUrlData } = supabase.storage.from('cardimages').getPublicUrl(filePath);
          newImageUrls.push(publicUrlData.publicUrl);
        }
      }

      // 3. Delete any images marked for deletion
      if (imagesToDelete.length > 0) {
        // Extract file paths from URLs
        for (const imageUrl of imagesToDelete) {
          const path = imageUrl.split('/').slice(-2).join('/');
          
          try {
            await supabase.storage
              .from('cardimages')
              .remove([`accessories/${path}`]);
          } catch (error) {
            console.error(`Failed to delete image: ${error.message}`);
            // Continue with other operations even if some deletions fail
          }
        }
      }

      // 4. Combine existing and new images for the final list
      const finalImageUrls = [...existingImages, ...newImageUrls];

      // 5. Ensure thumbnail is in the image list if not already
      if (finalThumbnailUrl && !finalImageUrls.includes(finalThumbnailUrl)) {
        finalImageUrls.push(finalThumbnailUrl);
      }

      // 6. Update accessory data
      const { error: updateError } = await supabase
        .from('accessories')
        .update({
          name,
          slug,
          description,
          category_id: categoryId,
          accessory_type: accessoryType,
          price: parseFloat(price),
          stock_quantity: parseInt(stock),
          image_urls: finalImageUrls,
          thumbnail_url: finalThumbnailUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', accessory.id);

      if (updateError) throw new Error(`Failed to update accessory: ${updateError.message}`);

      // Success handling
      setSuccessMessage('Accessory updated successfully!');
      
      // Reset new upload states
      setNewImages([]);
      setNewThumbnailFile(null);
      setImagesToDelete([]);
      setResetImageUploadKey(prevKey => prevKey + 1);
      
      setTimeout(() => {
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
      }, 1500);

    } catch (error) {
      console.error('Error updating accessory:', error);
      setSubmitError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Edit Accessory
        </Typography>
        <Button 
          component={Link} 
          href="/dashboard/accessories" 
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 2 }}
        >
          Back to Accessories
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          {/* Notifications */}
          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
                  {submitError}
                </Alert>
              </motion.div>
            )}
            
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
                  {successMessage}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Basic Information Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="primary" />
              Basic Information
            </Typography>
            
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Accessory Name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LabelIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    id="slug"
                    label="Slug"
                    name="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    error={!!formErrors.slug}
                    helperText={formErrors.slug}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              
              <TextField
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Classification & Pricing Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PriceCheckIcon color="primary" />
              Classification & Pricing
            </Typography>
            
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!formErrors.categoryId}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      value={categoryId}
                      label="Category"
                      onChange={(e) => setCategoryId(e.target.value)}
                      disabled={isSubmitting}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.categoryId && (
                      <FormHelperText>{formErrors.categoryId}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!formErrors.accessoryType}>
                    <InputLabel id="accessory-type-label">Accessory Type</InputLabel>
                    <Select
                      labelId="accessory-type-label"
                      id="accessoryType"
                      value={accessoryType}
                      label="Accessory Type"
                      onChange={(e) => setAccessoryType(e.target.value)}
                      disabled={isSubmitting}
                    >
                      {accessoryTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.accessoryType && (
                      <FormHelperText>{formErrors.accessoryType}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="price"
                    label="Price"
                    name="price"
                    type="number"
                    inputProps={{ min: 0, step: 0.01 }}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    error={!!formErrors.price}
                    helperText={formErrors.price}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="stock"
                    label="Stock Quantity"
                    name="stock"
                    type="number"
                    inputProps={{ min: 0, step: 1 }}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    error={!!formErrors.stock}
                    helperText={formErrors.stock}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <InventoryIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Images Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ImageIcon color="primary" />
              Images & Thumbnail
            </Typography>

            {/* Current images display */}
            {existingImages.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  Current Images:
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2
                }}>
                  {existingImages.map((imageUrl, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 120,
                        height: 168,
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 3
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={`Accessory image ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          border: imageUrl === thumbnailUrl ? '2px solid #f9a825' : 'none',
                          backgroundColor: 'rgba(0,0,0,0.04)'
                        }}
                      />
                      <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 0.75,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                      }}>
                        <Tooltip title={imageUrl === thumbnailUrl ? "Current thumbnail" : "Set as thumbnail"}>
                          <IconButton 
                            size="small"
                            onClick={() => handleSetAsThumbnail(imageUrl)}
                            sx={{
                              backgroundColor: imageUrl === thumbnailUrl ? 'rgba(249, 168, 37, 0.7)' : 'rgba(0,0,0,0.5)',
                              color: '#fff',
                              '&:hover': {
                                backgroundColor: imageUrl === thumbnailUrl ? 'rgba(249, 168, 37, 0.9)' : 'rgba(0,0,0,0.7)',
                              }
                            }}
                          >
                            {imageUrl === thumbnailUrl ? <StarIcon /> : <StarBorderIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove image">
                          <IconButton 
                            size="small"
                            onClick={() => handleRemoveExistingImage(imageUrl)}
                            sx={{
                              backgroundColor: 'rgba(220,0,0,0.5)',
                              color: '#fff',
                              '&:hover': { backgroundColor: 'rgba(220,0,0,0.7)' }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Upload new images */}
            <Alert severity="info" sx={{ mb: 2 }}>
              Upload new images to replace or add to the current ones (optional)
            </Alert>

            <Box 
              sx={{ 
                p: 3, 
                border: '1px dashed',
                borderColor: formErrors.images ? theme.palette.error.main : theme.palette.divider,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                transition: 'all 0.2s'
              }}
            >
              <ImageUpload
                bucketName="cardimages"
                pathPrefix="accessories"
                onUploadComplete={handleImageUploadComplete}
                resetKey={resetImageUploadKey}
                targetHeight={320}
                targetWidth={240}
              />
            </Box>

            {newImages.length > 0 && (
              <Fade in={true}>
                <Alert 
                  severity="success" 
                  sx={{ mt: 2 }}
                  icon={<CheckCircleOutlineIcon />}
                >
                  {newImages.length} new image(s) ready to upload.
                  {newThumbnailFile 
                    ? ' New thumbnail is set.' 
                    : ' You can set a new thumbnail using the "Make Thumb" button.'}
                </Alert>
              </Fade>
            )}
            
            {formErrors.images && (
              <FormHelperText error sx={{ ml: 2, mt: 0.5 }}>
                {formErrors.images}
              </FormHelperText>
            )}
            
            {formErrors.thumbnail && (
              <FormHelperText error sx={{ ml: 2, mt: 0.5 }}>
                {formErrors.thumbnail}
              </FormHelperText>
            )}
          </Box>

          {/* Submit Button */}
          <Divider sx={{ my: 3 }} />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{
                minWidth: 200,
                background: !isSubmitting
                  ? `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`
                  : undefined,
              }}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
} 