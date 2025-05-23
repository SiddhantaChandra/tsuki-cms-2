'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography,
  CircularProgress, Alert, Divider, useTheme, alpha, Paper, Stack, InputAdornment, Fade
} from '@mui/material';
import { createClient } from '@/utils/supabase/client';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import InfoIcon from '@mui/icons-material/Info';
import CategoryIcon from '@mui/icons-material/Category';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LanguageIcon from '@mui/icons-material/Language';
import ImageIcon from '@mui/icons-material/Image';
import GradeIcon from '@mui/icons-material/Grade';

export default function NewSlabForm({ 
    initialCategories, 
    loadingCategoriesExternal,
    categoryErrorExternal,
    onFormSubmitSuccess 
}) {
  const supabase = createClient();
  const theme = useTheme();

  // Form fields
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSet, setSelectedSet] = useState('');
  const [selectedSubset, setSelectedSubset] = useState('');
  const [selectedGradeCompany, setSelectedGradeCompany] = useState('');
  const [gradeScore, setGradeScore] = useState('');
  const [condition, setCondition] = useState('perfect'); // Default to Perfect
  const [language, setLanguage] = useState('Japanese');
  const [price, setPrice] = useState('');

  // Data for dropdowns
  const [categories, setCategories] = useState(initialCategories || []);
  const [sets, setSets] = useState([]);
  const [subsets, setSubsets] = useState([]);
  const [gradeCompanies, setGradeCompanies] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]); // Grades for the selected company

  // Loading states
  const [loadingSets, setLoadingSets] = useState(false);
  const [loadingSubsets, setLoadingSubsets] = useState(false);
  const [loadingGradeCompanies, setLoadingGradeCompanies] = useState(true);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  
  // Error/Success states
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Image files from ImageUpload component
  const [uploadedMainImageFiles, setUploadedMainImageFiles] = useState([]);
  const [uploadedThumbnailFile, setUploadedThumbnailFile] = useState(null);
  const imageUploadRef = useRef(null);

  useEffect(() => {
    setCategories(initialCategories || []);
  }, [initialCategories]);

  // Fetch Grade Companies
  useEffect(() => {
    const fetchGradeCompanies = async () => {
      setLoadingGradeCompanies(true);
      const { data, error } = await supabase.from('grade_companies').select('id, name, grades');
      if (error) {
        setSubmitError('Failed to load grading companies: ' + error.message);
        setGradeCompanies([]);
      } else {
        setGradeCompanies(data || []);
      }
      setLoadingGradeCompanies(false);
    };
    fetchGradeCompanies();
  }, [supabase]);

  // Fetch Sets when Category changes
  useEffect(() => {
    if (selectedCategory) {
      const fetchSets = async () => {
        setLoadingSets(true);
        setSets([]); setSelectedSet(''); setSubsets([]); setSelectedSubset('');
        const { data, error } = await supabase.from('sets').select('id, name').eq('category_id', selectedCategory);
        if (error) setSubmitError('Failed to load sets: ' + error.message); else setSets(data || []);
        setLoadingSets(false);
      };
      fetchSets();
    } else {
      setSets([]); setSelectedSet(''); setSubsets([]); setSelectedSubset('');
    }
  }, [selectedCategory, supabase]);

  // Fetch Subsets when Set changes
  useEffect(() => {
    if (selectedSet) {
      const fetchSubsets = async () => {
        if (!selectedSet) return;
        try {
          setLoadingSubsets(true);
          setSubsets([]);
          setSelectedSubset('');
          const { data, error } = await supabase
            .from('subsets')
            .select('id, name, slug, release_date')
            .eq('set_id', selectedSet);
          if (error) throw error;
          if (data) {
            // Sort subsets by release date (newest first), fallback to created_at if no release date
            const sortedSubsets = [...data].sort((a, b) => {
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
        } catch (error) {
          console.error("Error fetching subsets:", error.message);
        } finally {
          setLoadingSubsets(false);
        }
      };
      fetchSubsets();
    } else {
      setSubsets([]); setSelectedSubset('');
    }
  }, [selectedSet, supabase]);

  // Update available grades when grade company changes
  useEffect(() => {
    if (selectedGradeCompany) {
      const company = gradeCompanies.find(gc => gc.id === selectedGradeCompany);
      setAvailableGrades(company ? company.grades || [] : []);
      setGradeScore(''); // Reset grade score when company changes
    } else {
      setAvailableGrades([]);
      setGradeScore('');
    }
  }, [selectedGradeCompany, gradeCompanies]);

  const handleImageUploadComplete = (data) => {
    const { mainImageFiles, thumbnailImageFile } = data;
    setUploadedMainImageFiles(mainImageFiles || []);
    setUploadedThumbnailFile(thumbnailImageFile || null);
    
    console.log("Image upload complete:", {
      mainCount: mainImageFiles?.length || 0,
      hasThumbnail: Boolean(thumbnailImageFile)
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitLoading(true); setSubmitError(null); setSubmitSuccess(null);

    // Validation
    if (!name.trim()) { setSubmitError('Slab Name is required.'); setFormSubmitLoading(false); return; }
    if (uploadedMainImageFiles.length === 0) { setSubmitError('At least one slab image is required.'); setFormSubmitLoading(false); return; }
    if (!uploadedThumbnailFile) { 
      setSubmitError('Thumbnail is required. Please use the "Make Thumb" button on one of the images.'); 
      setFormSubmitLoading(false); 
      return; 
    }
    if (!selectedCategory) { setSubmitError('Category is required.'); setFormSubmitLoading(false); return; }
    if (!selectedSet) { setSubmitError('Set is required.'); setFormSubmitLoading(false); return; }
    if (!selectedSubset) { setSubmitError('Subset is required.'); setFormSubmitLoading(false); return; }
    if (!selectedGradeCompany) { setSubmitError('Grading Company is required.'); setFormSubmitLoading(false); return; }
    if (!gradeScore) { setSubmitError('Grade Score is required.'); setFormSubmitLoading(false); return; }
    if (!condition.trim()) { setSubmitError('Condition is required.'); setFormSubmitLoading(false); return; }
    if (!language.trim()) { setSubmitError('Language is required.'); setFormSubmitLoading(false); return; }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) { setSubmitError('Price must be a positive number.'); setFormSubmitLoading(false); return; }
    if (categoryErrorExternal) { setSubmitError('Cannot submit, categories failed to load on parent page.'); setFormSubmitLoading(false); return;}

    try {
      const slabName = name.trim();
      const baseSlug = slugify(slabName, { lower: true, strict: true, remove: /[*+~.()\'\"!:@]/g });
      const uniqueId = uuidv4().substring(0, 8);
      const finalSlug = `${baseSlug}-${uniqueId}`;

      const uploadedImageUrls = [];
      let finalThumbnailUrl = null;

      for (const uploadedMainImageFile of uploadedMainImageFiles) {
        const originalName = uploadedMainImageFile.name.substring(0, uploadedMainImageFile.name.lastIndexOf('.') || uploadedMainImageFile.name.length);
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const filePath = `slabs/${year}/${month}/${day}/${uuidv4()}.webp`;
        
        const { error: uploadError } = await supabase.storage
          .from('slabimages')
          .upload(filePath, uploadedMainImageFile, { contentType: uploadedMainImageFile.type, upsert: false });
        if (uploadError) throw new Error('Failed to upload main image ' + uploadedMainImageFile.name + ': ' + uploadError.message);
        
        const { data: { publicUrl } } = supabase.storage.from('slabimages').getPublicUrl(filePath);
        uploadedImageUrls.push(publicUrl);
      }

      if (uploadedThumbnailFile) {
        const originalName = uploadedThumbnailFile.name.substring(0, uploadedThumbnailFile.name.lastIndexOf('.') || uploadedThumbnailFile.name.length);
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const thumbFilePath = `slabs/${year}/${month}/${day}/${uuidv4()}_thumb.webp`;

        const { error: thumbUploadError } = await supabase.storage
          .from('slabimages')
          .upload(thumbFilePath, uploadedThumbnailFile, { contentType: uploadedThumbnailFile.type, upsert: false });
        if (thumbUploadError) throw new Error('Failed to upload thumbnail ' + uploadedThumbnailFile.name + ': ' + thumbUploadError.message);
        const { data: { publicUrl: thumbPublicUrl } } = supabase.storage.from('slabimages').getPublicUrl(thumbFilePath);
        finalThumbnailUrl = thumbPublicUrl;
      }
      
      const slabData = {
        name: slabName,
        slug: finalSlug,
        image_urls: uploadedImageUrls,
        thumbnail_url: finalThumbnailUrl,
        category_id: selectedCategory,
        set_id: selectedSet,
        subset_id: selectedSubset,
        grade_company_id: selectedGradeCompany,
        grade_score: parseFloat(gradeScore),
        condition: condition.trim(),
        language: language.trim(),
        price: priceValue,
      };
      
      const { error: insertError } = await supabase.from('slabs').insert(slabData);
      if (insertError) throw new Error('Failed to insert slab: ' + insertError.message);

      setSubmitSuccess('Slab added successfully!');
      // Reset form fields
      setName(''); setSelectedCategory(''); setSelectedSet(''); setSelectedSubset('');
      setSelectedGradeCompany(''); setGradeScore(''); setCondition('perfect'); setLanguage('Japanese'); setPrice('');
      setUploadedMainImageFiles([]); setUploadedThumbnailFile(null);
      // Reset ImageUpload component internal state
      if (imageUploadRef.current && imageUploadRef.current.reset) {
        imageUploadRef.current.reset();
      }
      // Consider a prop to tell ImageUpload to reset if it has complex internal state not cleared by new file array
      if(onFormSubmitSuccess) onFormSubmitSuccess();

    } catch (err) {
      setSubmitError('Operation failed: ' + err.message);
      console.error("Submit Error Details:", err);
    } finally {
      setFormSubmitLoading(false);
    }
  };

  if (loadingCategoriesExternal) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading category data from parent...</Typography>
      </Box>
    );
  }
  if (categoryErrorExternal) {
    return (
      <Alert severity="error" sx={{ mb: 3, mt: 2 }}>
        {typeof categoryErrorExternal === 'string' ? categoryErrorExternal : 'Error loading categories from parent.'}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Add New Slab
        </Typography>
        <Button 
          component={Link} 
          href="/dashboard/slabs" 
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 2 }}
        >
          Back to Slabs
        </Button>
      </Box>

      {/* Loading state */}
      {loadingCategoriesExternal && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading category data from parent...</Typography>
        </Box>
      )}

      {/* Error state */}
      {categoryErrorExternal && (
        <Alert severity="error" sx={{ mb: 3, mt: 2 }}>
          {typeof categoryErrorExternal === 'string' ? categoryErrorExternal : 'Error loading categories from parent.'}
        </Alert>
      )}

      {/* Form */}
      {!loadingCategoriesExternal && !categoryErrorExternal && (
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
                  label="Slab Name"
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

                <FormControl fullWidth required>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    value={condition}
                    label="Condition"
                    onChange={(e) => setCondition(e.target.value)}
                  >
                    <MenuItem value="perfect">Perfect</MenuItem>
                    <MenuItem value="scratched">Scratched</MenuItem>
                    <MenuItem value="damaged">Damaged</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Grading Information Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <GradeIcon color="primary" />
                Grading Information
              </Typography>
              
              <Stack spacing={3}>
                <FormControl fullWidth required disabled={loadingGradeCompanies}>
                  <InputLabel>Grading Company</InputLabel>
                  <Select
                    value={selectedGradeCompany}
                    label="Grading Company"
                    onChange={(e) => setSelectedGradeCompany(e.target.value)}
                  >
                    <MenuItem value=""><em>Select Grading Company</em></MenuItem>
                    {gradeCompanies.map((gc) => (
                      <MenuItem key={gc.id} value={gc.id}>{gc.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth required disabled={!selectedGradeCompany || availableGrades.length === 0}>
                  <InputLabel>Grade Score</InputLabel>
                  <Select
                    value={gradeScore}
                    label="Grade Score"
                    onChange={(e) => setGradeScore(e.target.value)}
                  >
                    <MenuItem value=""><em>Select Grade Score</em></MenuItem>
                    {availableGrades.map((grade) => (
                      <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                Upload clear images of your slab. At least one image and a thumbnail are required.
              </Alert>

              <ImageUpload 
                bucketName="slabimages" 
                pathPrefix="slabs" 
                onUploadComplete={handleImageUploadComplete} 
                ref={imageUploadRef}
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
            </Box>

            {/* Submit Button */}
            <Divider sx={{ my: 3 }} />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => window.history.back()}
                disabled={formSubmitLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={formSubmitLoading}
                startIcon={formSubmitLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  minWidth: 200,
                  background: !formSubmitLoading
                    ? `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`
                    : undefined,
                }}
              >
                {formSubmitLoading ? 'Adding Slab...' : 'Add Slab to Collection'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      )}
    </Box>
  );
} 