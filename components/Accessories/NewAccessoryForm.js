'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import {
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Box,
  Divider,
  InputAdornment,
  Fade,
  Tooltip,
  Stack,
  Grid,
  useTheme
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import StyleIcon from '@mui/icons-material/Style';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ImageIcon from '@mui/icons-material/Image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewAccessoryForm({ categories }) {
  const supabase = createClient();
  const router = useRouter();
  const theme = useTheme();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [accessoryType, setAccessoryType] = useState('');
  const [mainImages, setMainImages] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState(false);

  const [resetImageUploadKey, setResetImageUploadKey] = useState(0);

  // Predefined accessory types
  const accessoryTypes = ['Binder', 'Sleeve', 'Toploader', 'Grading Service', 'Storage Box', 'Display Case', 'Other'];

  const generateSlug = useCallback((currentName) => {
    if (currentName) {
      const randomSuffix = uuidv4().slice(0, 8);
      const newSlug = slugify(`${currentName}-${randomSuffix}`, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });
      setSlug(newSlug);
    } else {
      setSlug('');
    }
  }, []);

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    generateSlug(newName);
  };

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required.';
    if (!slug.trim()) errors.slug = 'Slug is required (auto-generated from name).';
    if (!categoryId) errors.categoryId = 'Category is required.';
    if (!accessoryType) errors.accessoryType = 'Accessory type is required.';
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      errors.price = 'Valid price is required.';
    }
    if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      errors.stock = 'Valid stock quantity is required.';
    }
    if (mainImages.length === 0) {
        errors.images = 'At least one image is required.';
    }
    if (!thumbnailFile) {
        errors.images = errors.images ? errors.images + ' Thumbnail generation failed or no image uploaded.' : 'Thumbnail generation failed or no image uploaded.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUploadComplete = useCallback(({ mainImageFiles, thumbnailImageFile }) => {
    console.log('[NewAccessoryForm] handleImageUploadComplete called. Data:', { mainFiles: mainImageFiles?.length, thumbFile: thumbnailImageFile?.name });
    setMainImages(mainImageFiles || []);
    setThumbnailFile(thumbnailImageFile);
    if (formErrors.images) {
        setFormErrors(prev => ({...prev, images: null}));
    }
  }, [formErrors.images]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setSubmitError("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Upload Thumbnail
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const thumbDatePath = new Date().toISOString().split('T')[0].replace(/-/g, '/');
        const thumbFileName = `thumb_${uuidv4()}_${slugify(thumbnailFile.name, { lower: true, strict: true })}`;
        const thumbPath = `accessories/${thumbDatePath}/${thumbFileName}`;

        const { data: thumbUploadData, error: thumbUploadError } = await supabase.storage
          .from('cardimages') // Assuming 'cardimages' is the general bucket for all product images
          .upload(thumbPath, thumbnailFile);

        if (thumbUploadError) throw new Error(`Thumbnail upload failed: ${thumbUploadError.message}`);
        
        const { data: publicThumbUrlData } = supabase.storage.from('cardimages').getPublicUrl(thumbPath);
        thumbnailUrl = publicThumbUrlData.publicUrl;
      } else {
        throw new Error("Thumbnail is required.");
      }

      // 2. Upload Main Images
      const imageUrls = [];
      if (mainImages.length > 0) {
        for (const imageFile of mainImages) {
          const datePath = new Date().toISOString().split('T')[0].replace(/-/g, '/');
          const fileName = `${uuidv4()}_${slugify(imageFile.name, { lower: true, strict: true })}`;
          const filePath = `accessories/${datePath}/${fileName}`;

          const { error: imageUploadError } = await supabase.storage
            .from('cardimages') // Assuming 'cardimages' is the general bucket
            .upload(filePath, imageFile);

          if (imageUploadError) throw new Error(`Image upload failed for ${imageFile.name}: ${imageUploadError.message}`);
          
          const { data: publicUrlData } = supabase.storage.from('cardimages').getPublicUrl(filePath);
          imageUrls.push(publicUrlData.publicUrl);
        }
      } else {
          throw new Error("At least one main image is required.");
      }

      // 3. Insert Accessory Data
      const { error: insertError } = await supabase.from('accessories').insert({
        name,
        slug,
        description,
        category_id: categoryId,
        accessory_type: accessoryType,
        price: parseFloat(price),
        stock_quantity: parseInt(stock),
        image_urls: imageUrls,
        thumbnail_url: thumbnailUrl,
      });

      if (insertError) throw new Error(`Database insert failed: ${insertError.message}`);

      // Reset form
      setName('');
      setSlug('');
      setDescription('');
      setCategoryId('');
      setPrice('');
      setStock('');
      setAccessoryType('');
      
      // Reset image upload state
      setMainImages([]);
      setThumbnailFile(null);
      // Reset the image uploader component
      setResetImageUploadKey(prevKey => prevKey + 1);
      
      // Show success animation
      setFormSuccess(true);
      
      // Navigate to accessories list page after successful creation
      setTimeout(() => {
        router.push('/dashboard/accessories');
      }, 1000);

    } catch (error) {
      console.error('Error submitting accessory:', error);
      setSubmitError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Add New Accessory
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
            
            {formSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setFormSuccess(false)}>
                  Accessory created successfully! Redirecting...
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
                required
                fullWidth
                id="name"
                label="Accessory Name"
                name="name"
                value={name}
                onChange={handleNameChange}
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
              
              <Tooltip title="Auto-generated from name" arrow placement="top">
                <TextField
                  fullWidth
                  id="slug"
                  label="Slug"
                  name="slug"
                  value={slug}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  error={!!formErrors.slug}
                  helperText={formErrors.slug}
                  disabled={isSubmitting}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    },
                  }}
                />
              </Tooltip>
              
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

            <Alert severity="info" sx={{ mb: 2 }}>
              Upload clear images of your accessory. At least one image and a thumbnail are required.
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
            
            {mainImages.length > 0 && (
              <Fade in={true}>
                <Alert 
                  severity="success" 
                  sx={{ mt: 2 }}
                  icon={<CheckCircleOutlineIcon />}
                >
                  {mainImages.length} image(s) ready. 
                  {thumbnailFile 
                    ? ' Thumbnail is set.' 
                    : ' Please select a thumbnail using the "Make Thumb" button.'}
                </Alert>
              </Fade>
            )}
            
            {formErrors.images && (
              <FormHelperText error sx={{ ml: 2, mt: 0.5 }}>
                {formErrors.images}
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
              {isSubmitting ? 'Adding Accessory...' : 'Add Accessory to Collection'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
} 