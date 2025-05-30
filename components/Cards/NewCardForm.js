'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography,
  CircularProgress, Alert, Card, CardContent, Paper, Chip, useTheme, alpha,
  Container, Stack, Divider, InputAdornment, Fade
} from '@mui/material';
import { createClient } from '@/utils/supabase/client';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import { useToast } from '@/components/UI/Toast';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { getConditionOptions } from '@/utils/cardUtils';
import { motion, AnimatePresence } from 'framer-motion';

// Icons for each section
import InfoIcon from '@mui/icons-material/Info';
import CategoryIcon from '@mui/icons-material/Category';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LanguageIcon from '@mui/icons-material/Language';
import ImageIcon from '@mui/icons-material/Image';
import Link from 'next/link';

// Motion components
const MotionCard = motion.create(Card);
const MotionBox = motion.create(Box);

export default function NewCardForm({ initialCategories, onFormSubmitSuccess, loadingCategories, categoryError }) {
  console.log('[NewCardForm] Function body execution (render start). LoadingCategories:', loadingCategories, 'CategoryError:', categoryError);
  const supabase = createClient();
  const theme = useTheme();
  const { showToast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSet, setSelectedSet] = useState('');
  const [selectedSubset, setSelectedSubset] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('10'); // Default to Gem Mint (10)
  const [language, setLanguage] = useState('Japanese'); // Default to Japanese

  // Data state
  const [categories, setCategories] = useState(initialCategories || []);
  const [sets, setSets] = useState([]);
  const [subsets, setSubsets] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [resetImageUploadKey, setResetImageUploadKey] = useState(0); // Key to trigger reset of ImageUpload

  const [uploadedMainImageFiles, setUploadedMainImageFiles] = useState([]);
  const [uploadedThumbnailFile, setUploadedThumbnailFile] = useState(null);

  // Refs for tracking renders and resetting components
  const isInitialMount = useRef(true);
  const renderCount = useRef(0);
  const imageUploadRef = useRef(null);
  
  renderCount.current += 1;

  useEffect(() => {
    if (isInitialMount.current) {
      console.log(`[NewCardForm] Mounted. Render count: ${renderCount.current}`);
      isInitialMount.current = false;
    }
    return () => {
      console.log(`[NewCardForm] Unmounting. Final render count: ${renderCount.current}.`);
    };
  }, []);

  useEffect(() => {
    // Update categories state when initialCategories prop changes
    console.log('[NewCardForm] initialCategories prop changed:', initialCategories);
    setCategories(initialCategories || []);
    if ((initialCategories || []).length > 0) {
        console.log('[NewCardForm] Categories updated from prop. Current selectedCategory:', selectedCategory);
    }
  }, [initialCategories]);

  useEffect(() => {
    if (selectedCategory) {
      const fetchSets = async () => {
        setSets([]); setSelectedSet(''); setSubsets([]); setSelectedSubset('');
        const { data, error: fetchError } = await supabase.from('sets').select('id, name').eq('category_id', selectedCategory);
        if (fetchError) setSubmitError('Failed to load sets: ' + fetchError.message); else setSets(data || []);
      };
      fetchSets();
    } else {
      setSets([]); setSelectedSet(''); setSubsets([]); setSelectedSubset('');
    }
  }, [selectedCategory, supabase]);

  useEffect(() => {
    if (selectedSet) {
      const fetchSubsets = async () => {
        setSubsets([]); setSelectedSubset('');
        const { data, error: fetchError } = await supabase.from('subsets').select('id, name, slug, release_date').eq('set_id', selectedSet);
        if (fetchError) setSubmitError('Failed to load subsets: ' + fetchError.message); 
        else {
          // Sort subsets by release date (newest first), fallback to created_at if no release date
          const sortedSubsets = [...(data || [])].sort((a, b) => {
            // If both have release dates, compare them
            if (a.release_date && b.release_date) {
              return new Date(b.release_date) - new Date(a.release_date); // newest first
            }
            // If only one has release date, prioritize the one with release date
            else if (a.release_date) return -1;
            else if (b.release_date) return 1;
            // If neither has release date, keep original order
            else return 0;
          });
          setSubsets(sortedSubsets);
        }
      };
      fetchSubsets();
    } else {
      setSubsets([]); setSelectedSubset('');
    }
  }, [selectedSet, supabase]);

  const handleImageUploadComplete = (data) => {
    console.log('[NewCardForm] handleImageUploadComplete called. Data:', data);
    const { mainImageFiles, thumbnailImageFile } = data;
    const newMainImages = mainImageFiles || [];
    const newThumbnail = thumbnailImageFile || null;

    console.log('[NewCardForm] Before set state in handleImageUploadComplete. Current main files count:', uploadedMainImageFiles.length, 'Current thumb:', uploadedThumbnailFile?.name);
    setUploadedMainImageFiles(newMainImages);
    setUploadedThumbnailFile(newThumbnail);
    console.log('[NewCardForm] After set state in handleImageUploadComplete. Attempted to set main files count:', newMainImages.length, 'Attempted thumb:', newThumbnail?.name);
  };

  useEffect(() => {
    if (!isInitialMount.current) {
        console.log('[NewCardForm] useEffect for image states: uploadedMainImageFiles count:', uploadedMainImageFiles.length, 'uploadedThumbnailFile:', uploadedThumbnailFile ? uploadedThumbnailFile.name : null);
    }
  }, [uploadedMainImageFiles, uploadedThumbnailFile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); setSubmitError(null); setSubmitSuccess(null);

    // Stricter Validations
    if (!name.trim()) { 
      setSubmitError('Card Name is required.'); 
      showToast('Card Name is required.', { severity: 'error' });
      setLoading(false); 
      return; 
    }
    if (uploadedMainImageFiles.length === 0) { 
      setSubmitError('At least one card image is required.'); 
      showToast('At least one card image is required.', { severity: 'error' });
      setLoading(false); 
      return; 
    }
    if (!uploadedThumbnailFile) { 
      setSubmitError('Thumbnail is required. Please use the "Make Thumb" button on one of the images.'); 
      showToast('Thumbnail is required.', { severity: 'error' });
      setLoading(false); 
      return; 
    }
    if (!selectedCategory) { 
      setSubmitError('Category is required.'); 
      showToast('Category is required.', { severity: 'error' });
      setLoading(false); 
      return; 
    }
    if (!selectedSet) { 
      setSubmitError('Set is required.'); 
      showToast('Set is required.', { severity: 'error' });
      setLoading(false); 
      return; 
    }
    if (!selectedSubset) { 
      setSubmitError('Subset is required.'); 
      showToast('Subset is required.', { severity: 'error' });
      setLoading(false); 
      return; 
    }
    if (!condition.trim()) { 
      setSubmitError('Condition is required.'); 
      showToast('Condition is required.', { severity: 'error' });
      setLoading(false); 
      return; 
    }
    if (!language.trim()) { 
      setSubmitError('Language is required.'); 
      showToast('Language is required.', { severity: 'error' });
      setLoading(false); 
      return; 
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) { 
      setSubmitError('Price must be a positive number.'); 
      showToast('Price must be a positive number.', { severity: 'error' });
      setLoading(false); 
      return; 
    }
    if (categoryError) { 
      setSubmitError('Cannot submit, categories failed to load.'); 
      showToast('Cannot submit, categories failed to load.', { severity: 'error' });
      setLoading(false); 
      return;
    }

    try {
      const cardName = name.trim();
      const baseSlug = slugify(cardName, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
      const uniqueId = uuidv4().substring(0, 8);
      const finalSlug = `${baseSlug}-${uniqueId}`;

      const uploadedImageUrls = [];
      let finalThumbnailUrl = null;

      for (const file of uploadedMainImageFiles) {
        const originalName = file.name.substring(0, file.name.lastIndexOf('.') || file.name.length);
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const filePath = `cards/${year}/${month}/${day}/${uuidv4()}.webp`;
        
        const { error: uploadError } = await supabase.storage
          .from('cardimages')
          .upload(filePath, file, { contentType: file.type, upsert: false });
        if (uploadError) throw new Error(`Failed to upload main image ${file.name}: ${uploadError.message}`);
        
        const { data: { publicUrl } } = supabase.storage.from('cardimages').getPublicUrl(filePath);
        uploadedImageUrls.push(publicUrl);
      }

      if (uploadedThumbnailFile) {
        const originalName = uploadedThumbnailFile.name.substring(0, uploadedThumbnailFile.name.lastIndexOf('.') || uploadedThumbnailFile.name.length);
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const thumbFilePath = `cards/${year}/${month}/${day}/${uuidv4()}_thumb.webp`;

        const { error: thumbUploadError } = await supabase.storage
          .from('cardimages')
          .upload(thumbFilePath, uploadedThumbnailFile, { contentType: uploadedThumbnailFile.type, upsert: false });
        if (thumbUploadError) throw new Error(`Failed to upload thumbnail ${uploadedThumbnailFile.name}: ${thumbUploadError.message}`);
        const { data: { publicUrl: thumbPublicUrl } } = supabase.storage.from('cardimages').getPublicUrl(thumbFilePath);
        finalThumbnailUrl = thumbPublicUrl;
      }
      
      const cardData = {
        name: cardName,
        slug: finalSlug,
        image_urls: uploadedImageUrls,
        thumbnail_url: finalThumbnailUrl,
        category_id: selectedCategory,
        set_id: selectedSet || null,
        subset_id: selectedSubset || null,
        price: parseFloat(price) || null,
        condition: condition.trim() || null,
        language: language.trim() || null,
      };
      
      console.log("Inserting card data:", cardData);

      const { error: insertError } = await supabase.from('cards').insert(cardData);
      if (insertError) throw new Error(`Failed to insert card: ${insertError.message}`);

      // Show success toast notification
      showToast('Card added successfully!', { 
        severity: 'success',
        title: 'Success'
      });

      // Reset form
      setName(''); 
      setSelectedCategory(''); 
      setSelectedSet(''); 
      setSelectedSubset(''); 
      setPrice(''); 
      setCondition(''); 
      setLanguage('');
      
      // Reset image upload state
      setUploadedMainImageFiles([]); 
      setUploadedThumbnailFile(null);
      // Reset the image uploader component
      setResetImageUploadKey(prevKey => prevKey + 1);
      
      // Set success message in the form
      setSubmitSuccess('Card added successfully!');

      // Notify parent component
      if(onFormSubmitSuccess) onFormSubmitSuccess();

    } catch (err) {
      const errorMessage = `Operation failed: ${err.message}`;
      setSubmitError(errorMessage);
      showToast(errorMessage, { 
        severity: 'error',
        title: 'Error' 
      });
      console.error("Submit Error Details:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log('[NewCardForm] Returning JSX. Current state snapshot just before render:', { uploadedMainImageFilesCount: uploadedMainImageFiles.length, uploadedThumbnailFileName: uploadedThumbnailFile?.name });

  if (loadingCategories) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading form data...</Typography>
      </Box>
    );
  }

  if (categoryError) {
    return (
      <Alert 
        severity="error" 
        sx={{ mb: 3, mt: 2 }}
        icon={<ErrorOutlineIcon fontSize="large" />}
      >
        {typeof categoryError === 'string' ? categoryError : 'An error occurred while loading essential data for the form.'}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Add New Card
        </Typography>
        <Button 
          component={Link} 
          href="/dashboard/cards" 
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 2 }}
        >
          Back to Collection
        </Button>
      </Box>

      {/* Loading state */}
      {loadingCategories && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading form data...</Typography>
        </Box>
      )}

      {/* Error state */}
      {categoryError && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, mt: 2 }}
          icon={<ErrorOutlineIcon fontSize="large" />}
        >
          {typeof categoryError === 'string' ? categoryError : 'An error occurred while loading essential data for the form.'}
        </Alert>
      )}

      {/* Form */}
      {!loadingCategories && !categoryError && (
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
                      <MenuItem key={sub.id} value={sub.id}>{sub.name} - {sub.slug}</MenuItem>
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
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                Upload clear images of your card. At least one image and a thumbnail are required.
              </Alert>

              <ImageUpload
                bucketName="cardimages"
                pathPrefix="cards"
                onUploadComplete={handleImageUploadComplete}
                resetKey={resetImageUploadKey}
              />
              
              {uploadedMainImageFiles.length > 0 && (
                <Fade in={true}>
                  <Alert 
                    severity="success" 
                    sx={{ mt: 2 }}
                    icon={<CheckCircleOutlineIcon />}
                  >
                    {uploadedMainImageFiles.length} image(s) ready.
                    {uploadedThumbnailFile 
                      ? ' Thumbnail is set.' 
                      : ' Please select a thumbnail using the "Make Thumb" button.'}
                  </Alert>
                </Fade>
              )}
              
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                <Chip label="Upload clear images" size="small" variant="outlined" />
                <Chip label="Create thumbnail from best image" size="small" variant="outlined" />
                <Chip label="Add multiple angles if available" size="small" variant="outlined" />
              </Stack>
            </Box>

            {/* Submit Button */}
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
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  minWidth: 200,
                  background: !loading
                    ? `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`
                    : undefined,
                }}
              >
                {loading ? 'Adding Card...' : 'Add Card to Collection'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      )}
    </Box>
  );
} 