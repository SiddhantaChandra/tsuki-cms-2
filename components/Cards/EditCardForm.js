'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography,
  CircularProgress, Alert, useTheme, alpha, IconButton, Tooltip, Card, CardContent,
  Stack, Chip, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  Paper, InputAdornment, Badge, Zoom, Fade, Collapse,
  List, ListItem, ListItemIcon, ListItemText, LinearProgress
} from '@mui/material';
import { createClient } from '@/utils/supabase/client';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import { useToast } from '@/components/UI/Toast';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import InfoIcon from '@mui/icons-material/Info';
import CategoryIcon from '@mui/icons-material/Category';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SaveIcon from '@mui/icons-material/Save';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import HistoryIcon from '@mui/icons-material/History';
import LanguageIcon from '@mui/icons-material/Language';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

// Motion components
const MotionCard = motion(Card);
const MotionBox = motion(Box);

export default function ModernEditCardForm({ initialCardData, initialCategories, onFormSubmitSuccess }) {
  const supabase = createClient();
  const theme = useTheme();
  const { showToast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSet, setSelectedSet] = useState('');
  const [selectedSubset, setSelectedSubset] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [language, setLanguage] = useState('Japanese');

  // Data state
  const [categories, setCategories] = useState(initialCategories || []);
  const [sets, setSets] = useState([]);
  const [subsets, setSubsets] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Image state
  const [uploadedMainImageFiles, setUploadedMainImageFiles] = useState([]);
  const [uploadedThumbnailFile, setUploadedThumbnailFile] = useState(null);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState(null);
  const [hasNewImages, setHasNewImages] = useState(false);
  const [hasNewThumbnail, setHasNewThumbnail] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Original values for change detection
  const [originalValues, setOriginalValues] = useState({});

  // Initialize form with existing card data
  useEffect(() => {
    if (initialCardData) {
      const values = {
        name: initialCardData.name || '',
        category: initialCardData.category_id || '',
        set: initialCardData.set_id || '',
        subset: initialCardData.subset_id || '',
        price: initialCardData.price ? String(initialCardData.price) : '',
        condition: initialCardData.condition || '',
        language: initialCardData.language || 'Japanese',
        imageUrls: initialCardData.image_urls || [],
        thumbnailUrl: initialCardData.thumbnail_url || null
      };

      setName(values.name);
      setSelectedCategory(values.category);
      setSelectedSet(values.set);
      setSelectedSubset(values.subset);
      setPrice(values.price);
      setCondition(values.condition);
      setLanguage(values.language);
      setExistingImageUrls(values.imageUrls);
      setExistingThumbnailUrl(values.thumbnailUrl);
      setOriginalValues(values);
    }
  }, [initialCardData]);

  // Detect changes
  useEffect(() => {
    const currentValues = {
      name,
      category: selectedCategory,
      set: selectedSet,
      subset: selectedSubset,
      price,
      condition,
      language,
      imageUrls: existingImageUrls,
      thumbnailUrl: existingThumbnailUrl
    };

    const changed = 
      currentValues.name !== originalValues.name ||
      currentValues.category !== originalValues.category ||
      currentValues.set !== originalValues.set ||
      currentValues.subset !== originalValues.subset ||
      currentValues.price !== originalValues.price ||
      currentValues.condition !== originalValues.condition ||
      currentValues.language !== originalValues.language ||
      JSON.stringify(currentValues.imageUrls) !== JSON.stringify(originalValues.imageUrls) ||
      currentValues.thumbnailUrl !== originalValues.thumbnailUrl ||
      hasNewImages ||
      hasNewThumbnail;

    setHasChanges(changed);
  }, [name, selectedCategory, selectedSet, selectedSubset, price, condition, language, 
      existingImageUrls, existingThumbnailUrl, originalValues, hasNewImages, hasNewThumbnail]);

  // Load sets and subsets
  useEffect(() => {
    setCategories(initialCategories || []);
  }, [initialCategories]);

  useEffect(() => {
    if (selectedCategory) {
      const fetchSets = async () => {
        try {
          const { data, error } = await supabase.from('sets').select('id, name').eq('category_id', selectedCategory);
          if (error) throw error;
          setSets(data || []);
        } catch (error) {
          console.error('Error fetching sets:', error);
        }
      };
      fetchSets();
    } else {
      setSets([]);
    }
  }, [selectedCategory, supabase]);

  useEffect(() => {
    if (selectedSet) {
      const fetchSubsets = async () => {
        try {
          const { data, error } = await supabase.from('subsets').select('id, name').eq('set_id', selectedSet);
          if (error) throw error;
          setSubsets(data || []);
        } catch (error) {
          console.error('Error fetching subsets:', error);
        }
      };
      fetchSubsets();
    } else {
      setSubsets([]);
    }
  }, [selectedSet, supabase]);

  const handleSelectAsThumbnail = async (imageUrl) => {
    try {
      setSubmitError(null);
      setLoading(true);

      const { error: updateError } = await supabase
        .from('cards')
        .update({ thumbnail_url: imageUrl })
        .eq('id', initialCardData.id);
        
      if (updateError) throw updateError;
      
      setExistingThumbnailUrl(imageUrl);
      showToast('Thumbnail updated successfully!', { 
        severity: 'success',
        title: 'Success'
      });
    } catch (err) {
      const errorMessage = `Failed to update thumbnail: ${err.message}`;
      setSubmitError(errorMessage);
      showToast(errorMessage, { 
        severity: 'error',
        title: 'Error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploadComplete = (data) => {
    const { mainImageFiles, thumbnailImageFile } = data;
    
    if (mainImageFiles && mainImageFiles.length > 0) {
      setUploadedMainImageFiles(mainImageFiles);
      setHasNewImages(true);
    }
    
    if (thumbnailImageFile) {
      setUploadedThumbnailFile(thumbnailImageFile);
      setHasNewThumbnail(true);
    }
  };

  const handleRemoveImage = async (imageUrl) => {
    try {
      setSubmitError(null);
      setLoading(true);
      
      const updatedImageUrls = existingImageUrls.filter(url => url !== imageUrl);
      const isThumbnail = imageUrl === existingThumbnailUrl;
      
      const updateData = {
        image_urls: updatedImageUrls
      };
      
      if (isThumbnail) {
        updateData.thumbnail_url = null;
      }
      
      const { error: updateError } = await supabase
        .from('cards')
        .update(updateData)
        .eq('id', initialCardData.id);
      
      if (updateError) throw updateError;
      
      setExistingImageUrls(updatedImageUrls);
      if (isThumbnail) {
        setExistingThumbnailUrl(null);
      }
      
      showToast('Image removed successfully!', { 
        severity: 'success',
        title: 'Success'
      });
    } catch (err) {
      const errorMessage = `Failed to remove image: ${err.message}`;
      setSubmitError(errorMessage);
      showToast(errorMessage, { 
        severity: 'error',
        title: 'Error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); 
    setSubmitError(null); 
    setSubmitSuccess(null);

    // Validations
    if (!name.trim()) { 
      setSubmitError('Card Name is required.'); 
      setLoading(false); 
      return; 
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) { 
      setSubmitError('Price must be a positive number.'); 
      setLoading(false); 
      return; 
    }

    try {
      const cardData = {
        name: name.trim(),
        category_id: selectedCategory,
        set_id: selectedSet,
        subset_id: selectedSubset,
        price: priceValue,
        condition: condition.trim(),
        language: language.trim(),
      };
      
      // Handle image uploads if new images were provided
      if (hasNewImages) {
        const uploadedImageUrls = [];
        for (const file of uploadedMainImageFiles) {
          const now = new Date();
          const year = now.getFullYear();
          const month = (now.getMonth() + 1).toString().padStart(2, '0');
          const day = now.getDate().toString().padStart(2, '0');
          const filePath = `cards/${year}/${month}/${day}/${uuidv4()}.webp`;
          
          const { error: uploadError } = await supabase.storage
            .from('cardimages')
            .upload(filePath, file, { contentType: file.type, upsert: false });
          
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage.from('cardimages').getPublicUrl(filePath);
          uploadedImageUrls.push(publicUrl);
        }
        
        cardData.image_urls = [...existingImageUrls, ...uploadedImageUrls];
      }

      // Handle thumbnail upload if a new thumbnail was provided
      if (hasNewThumbnail && uploadedThumbnailFile) {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const thumbFilePath = `cards/${year}/${month}/${day}/${uuidv4()}_thumb.webp`;

        const { error: thumbUploadError } = await supabase.storage
          .from('cardimages')
          .upload(thumbFilePath, uploadedThumbnailFile, { contentType: uploadedThumbnailFile.type, upsert: false });
          
        if (thumbUploadError) throw thumbUploadError;
        
        const { data: { publicUrl: thumbPublicUrl } } = supabase.storage.from('cardimages').getPublicUrl(thumbFilePath);
        cardData.thumbnail_url = thumbPublicUrl;
      }
      
      // Update the card in the database
      const { error: updateError } = await supabase
        .from('cards')
        .update(cardData)
        .eq('id', initialCardData.id);
        
      if (updateError) throw updateError;

      setSubmitSuccess('Card updated successfully!');
      showToast('Card updated successfully!', { 
        severity: 'success',
        title: 'Success'
      });
      
      if(onFormSubmitSuccess) {
        setTimeout(() => {
          onFormSubmitSuccess();
        }, 1500);
      }

    } catch (err) {
      const errorMessage = `Operation failed: ${err.message}`;
      setSubmitError(errorMessage);
      showToast(errorMessage, { 
        severity: 'error',
        title: 'Error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setImagePreviewOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Edit Card
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <ImageIcon color="primary" />
              <Typography variant="h6">{existingImageUrls.length}</Typography>
              <Typography variant="body2" color="text.secondary">Images</Typography>
            </CardContent>
          </MotionCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalOfferIcon color="success" />
              <Typography variant="h6">₹{price || '0'}</Typography>
              <Typography variant="body2" color="text.secondary">Current Price</Typography>
            </CardContent>
          </MotionCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <CategoryIcon color="info" />
              <Typography variant="h6">{categories.find(c => c.id === selectedCategory)?.name || 'N/A'}</Typography>
              <Typography variant="body2" color="text.secondary">Category</Typography>
            </CardContent>
          </MotionCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <EditIcon color="warning" />
              <Typography variant="h6">{hasChanges ? 'Modified' : 'No Changes'}</Typography>
              <Typography variant="body2" color="text.secondary">Status</Typography>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Form */}
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
        
        {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSubmitSuccess(null)}>
            {submitSuccess}
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
          <TextField
            fullWidth 
            label="Card Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOfferIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    InputProps={{
                      inputProps: { min: 0, step: "0.01" },
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={language}
                      label="Language"
                      onChange={(e) => setLanguage(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <LanguageIcon color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="Japanese">Japanese</MenuItem>
                      <MenuItem value="English">English</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Condition
                </Typography>
                <FormControl fullWidth required>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    value={condition}
                    label="Condition"
                    onChange={(e) => setCondition(e.target.value)}
                  >
                    <MenuItem value="10">Gem Mint</MenuItem>
                    <MenuItem value="9">Mint</MenuItem>
                    <MenuItem value="8">Near Mint</MenuItem>
                    <MenuItem value="7">Excellent</MenuItem>
                    <MenuItem value="6">Good</MenuItem>
                    <MenuItem value="5">Fair</MenuItem>
                    <MenuItem value="4">Poor</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
        </Box>

          <Divider sx={{ my: 4 }} />

        {/* Classification Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon color="primary" />
              Classification
            </Typography>
            
            <Stack spacing={3}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory} 
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value=""><em>Select Category</em></MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
            </Select>
          </FormControl>

              <FormControl fullWidth required disabled={!selectedCategory}>
                <InputLabel>Set</InputLabel>
            <Select
              value={selectedSet} 
              label="Set"
              onChange={(e) => setSelectedSet(e.target.value)}
            >
              <MenuItem value=""><em>Select Set</em></MenuItem>
                  {sets.map((s) => (
                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                  ))}
            </Select>
          </FormControl>

              <FormControl fullWidth required disabled={!selectedSet}>
                <InputLabel>Subset</InputLabel>
            <Select
              value={selectedSubset} 
              label="Subset"
              onChange={(e) => setSelectedSubset(e.target.value)}
            >
              <MenuItem value=""><em>Select Subset</em></MenuItem>
                  {subsets.map((sub) => (
                    <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
        </Box>

          <Divider sx={{ my: 4 }} />

          {/* Images Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ImageIcon color="primary" />
              Images & Thumbnail
              <Badge badgeContent={existingImageUrls.length} color="primary">
                <Box />
              </Badge>
            </Typography>
          
            {/* Current images grid */}
            {existingImageUrls.length > 0 && (
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Current Images
              </Typography>
                <Grid container spacing={2}>
                {existingImageUrls.map((url, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <MotionCard
                        whileHover={{ scale: 1.02 }}
                    sx={{ 
                      position: 'relative',
                      overflow: 'hidden',
                          borderRadius: 2,
                          border: url === existingThumbnailUrl ? `2px solid ${theme.palette.warning.main}` : 'none',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            paddingTop: '140%',
                            cursor: 'pointer',
                            '&:hover .image-overlay': {
                              opacity: 1,
                            }
                          }}
                          onClick={() => handleOpenPreview(url)}
                  >
                    <Box 
                      component="img" 
                      src={url}
                      alt={`Card image ${index + 1}`}
                      sx={{ 
                              position: 'absolute',
                              top: 0,
                              left: 0,
                        width: '100%', 
                        height: '100%', 
                              objectFit: 'cover',
                            }}
                          />
                          
                          {/* Overlay with actions */}
                          <Box
                            className="image-overlay"
                            sx={{
                      position: 'absolute',
                              top: 0,
                      left: 0,
                      right: 0,
                              bottom: 0,
                              background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
                              opacity: 0,
                              transition: 'opacity 0.3s ease',
                      display: 'flex',
                              flexDirection: 'column',
                      justifyContent: 'space-between',
                              p: 1,
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title={url === existingThumbnailUrl ? "Current thumbnail" : "Set as thumbnail"}>
                        <IconButton 
                          size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectAsThumbnail(url);
                                  }}
                          sx={{
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    color: '#fff',
                            '&:hover': {
                                      backgroundColor: 'rgba(0,0,0,0.7)',
                            }
                          }}
                        >
                          {url === existingThumbnailUrl ? (
                                    <StarIcon fontSize="small" />
                          ) : (
                                    <StarBorderIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                              <Tooltip title="Remove image">
                          <IconButton 
                            size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage(url);
                                  }}
                            sx={{
                              backgroundColor: 'rgba(0,0,0,0.5)',
                                    color: '#fff',
                              '&:hover': {
                                      backgroundColor: 'rgba(255,0,0,0.5)',
                              }
                            }}
                          >
                                  <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                              <Chip
                                icon={<VisibilityIcon />}
                                label="Click to preview"
                            size="small"
                            sx={{
                                  backgroundColor: 'rgba(255,255,255,0.9)',
                                  fontSize: '0.7rem',
                                }}
                              />
                      </Box>
                    </Box>
                  </Box>
                        
                        {url === existingThumbnailUrl && (
                          <Chip
                            label="Thumbnail"
                    size="small"
                            color="warning"
                    sx={{
                      position: 'absolute',
                              bottom: 8,
                              left: 8,
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </MotionCard>
                    </Grid>
                  ))}
                </Grid>
            </Box>
          )}
          
            <Divider sx={{ my: 3 }} />

            {/* Upload new images */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Add New Images
            </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Upload new images to add to the existing collection. New images will be appended, not replaced.
              </Alert>
            <ImageUpload
              key="image-uploader-edit"
              bucketName="cardimages"
              pathPrefix="cards"
              onUploadComplete={handleImageUploadComplete}
            />
          
          {(uploadedMainImageFiles.length > 0 || uploadedThumbnailFile) && (
                <Fade in={true}>
                  <Alert 
                    severity="success" 
                    sx={{ mt: 2 }}
                    icon={<CheckCircleOutlineIcon />}
                  >
                    {uploadedMainImageFiles.length > 0 && `${uploadedMainImageFiles.length} new image(s) ready to upload. `}
                    {uploadedThumbnailFile && 'New thumbnail selected.'}
                  </Alert>
                </Fade>
              )}
            </Box>
        </Box>

          {/* Action buttons */}
          <Divider sx={{ my: 3 }} />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => window.history.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          <Button
            type="submit"
            variant="contained"
              disabled={loading || !hasChanges}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ 
                minWidth: 150,
                background: hasChanges && !loading
                  ? `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`
                  : undefined,
              }}
            >
              {loading ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
          </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Image Preview Dialog */}
      <Dialog
        open={imagePreviewOpen}
        onClose={() => setImagePreviewOpen(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Image Preview
          <IconButton onClick={() => setImagePreviewOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {previewImage && (
            <Box
              component="img"
              src={previewImage}
              alt="Preview"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
          </Box>
  );
} 