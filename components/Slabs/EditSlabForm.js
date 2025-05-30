'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography,
  CircularProgress, Alert, Divider, IconButton, Tooltip, Modal, Slider, useTheme,
  Paper, Stack, InputAdornment, Fade
} from '@mui/material';
import { createClient } from '@/utils/supabase/client';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import DraggableImageItem from '@/components/ImageUpload/DraggableImageItem';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CropIcon from '@mui/icons-material/Crop';
import { Cropper, RectangleStencil } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import imageCompression from 'browser-image-compression';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

// Icons
import InfoIcon from '@mui/icons-material/Info';
import CategoryIcon from '@mui/icons-material/Category';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LanguageIcon from '@mui/icons-material/Language';
import ImageIcon from '@mui/icons-material/Image';
import GradeIcon from '@mui/icons-material/Grade';

export default function EditSlabForm({ 
    initialSlab,
    initialCategories, 
    loadingCategoriesExternal,
    categoryErrorExternal,
    onFormSubmitSuccess 
}) {
  const supabase = createClient();
  const theme = useTheme();

  // Form fields
  const [name, setName] = useState(initialSlab?.name || '');
  const [slug, setSlug] = useState(initialSlab?.slug || '');
  const [selectedCategory, setSelectedCategory] = useState(initialSlab?.category_id || '');
  const [selectedSet, setSelectedSet] = useState(initialSlab?.set_id || '');
  const [selectedSubset, setSelectedSubset] = useState(initialSlab?.subset_id || '');
  const [selectedGradeCompany, setSelectedGradeCompany] = useState(initialSlab?.grade_company_id || '');
  const [gradeScore, setGradeScore] = useState(initialSlab?.grade_score?.toString() || '');
  const [condition, setCondition] = useState(initialSlab?.condition || 'perfect');
  const [language, setLanguage] = useState(initialSlab?.language || 'Japanese');
  const [price, setPrice] = useState(initialSlab?.price?.toString() || '');

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

  // Image management
  const [existingImageUrls, setExistingImageUrls] = useState(initialSlab?.image_urls || []);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState(initialSlab?.thumbnail_url || null);
  const [uploadedMainImageFiles, setUploadedMainImageFiles] = useState([]);
  const [uploadedThumbnailFile, setUploadedThumbnailFile] = useState(null);
  const [hasNewImages, setHasNewImages] = useState(false);
  const [hasNewThumbnail, setHasNewThumbnail] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Cropping state
  const [cropperImage, setCropperImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const cropperRef = useRef(null);
  const [croppingImageIndex, setCroppingImageIndex] = useState(null);

  // DND Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        
        // Don't clear selectedSet if we're initializing with data from initialSlab
        const isInitialLoad = selectedCategory === initialSlab?.category_id && 
                              selectedSet === initialSlab?.set_id;
        
        if (!isInitialLoad) {
          setSets([]);
          setSelectedSet('');
          setSubsets([]);
          setSelectedSubset('');
        }
        
        const { data, error } = await supabase.from('sets').select('id, name').eq('category_id', selectedCategory);
        if (error) setSubmitError('Failed to load sets: ' + error.message); else setSets(data || []);
        setLoadingSets(false);
      };
      fetchSets();
    } else {
      setSets([]); setSelectedSet(''); setSubsets([]); setSelectedSubset('');
    }
  }, [selectedCategory, supabase, initialSlab?.category_id, initialSlab?.set_id, selectedSet]);

  // Fetch Subsets when Set changes
  useEffect(() => {
    if (selectedSet) {
      const fetchSubsets = async () => {
        if (!selectedSet) return;
        try {
          setLoadingSubsets(true);
          
          // Don't clear selectedSubset if we're initializing with data from initialSlab
          const isInitialLoad = selectedSet === initialSlab?.set_id && 
                                selectedSubset === initialSlab?.subset_id;
          
          if (!isInitialLoad) {
            setSubsets([]);
            setSelectedSubset('');
          }
          
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
  }, [selectedSet, supabase, initialSlab?.set_id, selectedSubset, initialSlab?.subset_id]);

  // Update available grades when grade company changes
  useEffect(() => {
    if (selectedGradeCompany) {
      const company = gradeCompanies.find(gc => gc.id === selectedGradeCompany);
      setAvailableGrades(company ? company.grades || [] : []);
      if (!gradeScore) {
        setGradeScore(''); // Only reset grade score if it's not already set
      }
    } else {
      setAvailableGrades([]);
      setGradeScore('');
    }
  }, [selectedGradeCompany, gradeCompanies, gradeScore]);

  // Load sets and subsets for the initial slab when component mounts
  useEffect(() => {
    const loadInitialData = async () => {
      if (initialSlab && categories.length > 0) {
        // Load sets if category is selected
        if (initialSlab.category_id && !sets.length) {
          try {
            setLoadingSets(true);
            const { data: setsData, error: setsError } = await supabase
              .from('sets')
              .select('id, name')
              .eq('category_id', initialSlab.category_id);
            if (setsError) throw setsError;
            setSets(setsData || []);
          } catch (error) {
            console.error("Error loading initial sets:", error);
          } finally {
            setLoadingSets(false);
          }
        }
        
        // Load subsets if set is selected
        if (initialSlab.set_id && !subsets.length) {
          try {
            setLoadingSubsets(true);
            const { data: subsetsData, error: subsetsError } = await supabase
              .from('subsets')
              .select('id, name, slug, release_date')
              .eq('set_id', initialSlab.set_id);
            if (subsetsError) throw subsetsError;
            if (subsetsData) {
              const sortedSubsets = [...subsetsData].sort((a, b) => {
                if (a.release_date && b.release_date) {
                  return new Date(b.release_date) - new Date(a.release_date);
                }
                else if (a.release_date) return -1;
                else if (b.release_date) return 1;
                else return 0;
              });
              setSubsets(sortedSubsets);
            }
          } catch (error) {
            console.error("Error loading initial subsets:", error);
          } finally {
            setLoadingSubsets(false);
          }
        }
      }
    };
    
    loadInitialData();
  }, [initialSlab, categories, supabase, sets.length, subsets.length]);

  const handleImageUploadComplete = (data) => {
    const { mainImageFiles, thumbnailImageFile } = data;
    setUploadedMainImageFiles(mainImageFiles || []);
    setUploadedThumbnailFile(thumbnailImageFile || null);
    setHasNewImages((mainImageFiles || []).length > 0);
    setHasNewThumbnail(Boolean(thumbnailImageFile));
    
    console.log("Image upload complete:", {
      mainCount: mainImageFiles?.length || 0,
      hasThumbnail: Boolean(thumbnailImageFile)
    });
  };

  const handleRemoveImage = (imageUrl) => {
    setExistingImageUrls(prev => prev.filter(url => url !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
    
    // If the removed image was the thumbnail, clear it
    if (imageUrl === existingThumbnailUrl) {
      setExistingThumbnailUrl(null);
    }
  };

  const handleSetAsThumbnail = (imageUrl) => {
    setExistingThumbnailUrl(imageUrl);
  };

  const handleCropImage = (imageUrl, imageIndex) => {
    setCroppingImageIndex(imageIndex);
    setCropperImage(imageUrl);
    setShowCropper(true);
  };

  const handleCloseCropper = () => {
    setShowCropper(false);
    setCropperImage(null);
    setCroppingImageIndex(null);
  };

  const handleSaveCrop = async () => {
    if (!cropperRef.current || croppingImageIndex === null) return;
    
    setFormSubmitLoading(true);
    try {
      const canvas = cropperRef.current.getCanvas();
      if (!canvas) throw new Error('Failed to get cropped canvas');
      
      // Convert canvas to blob
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/webp', 0.8);
      });
      
      if (!blob) throw new Error('Failed to create blob from canvas');
      
      // Compress the image
      const compressedFile = await imageCompression(blob, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });
      
      // Upload the cropped image
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const filePath = `slabs/${year}/${month}/${day}/${uuidv4()}_cropped.webp`;
      
      const { error: uploadError } = await supabase.storage
        .from('slabimages')
        .upload(filePath, compressedFile, { 
          contentType: 'image/webp',
          upsert: false 
        });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('slabimages')
        .getPublicUrl(filePath);
      
      // Replace the original image with the cropped one
      const oldImageUrl = existingImageUrls[croppingImageIndex];
      setExistingImageUrls(prev => {
        const newUrls = [...prev];
        newUrls[croppingImageIndex] = publicUrl;
        return newUrls;
      });
      
      // Update thumbnail if it was the cropped image
      if (oldImageUrl === existingThumbnailUrl) {
        setExistingThumbnailUrl(publicUrl);
      }
      
      // Mark old image for deletion
      setImagesToDelete(prev => [...prev, oldImageUrl]);
      
      setSubmitSuccess('Image cropped successfully!');
      handleCloseCropper();
      
    } catch (error) {
      console.error('Crop error:', error);
      setSubmitError('Failed to crop image: ' + error.message);
    } finally {
      setFormSubmitLoading(false);
    }
  };

  const handleClearThumbnail = () => {
    setExistingThumbnailUrl(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setExistingImageUrls((items) => {
        const oldIndex = items.findIndex(item => item === active.id);
        const newIndex = items.findIndex(item => item === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  const handleOpenPreview = (imageUrl) => {
    // Simple preview - could be enhanced with a modal later
    window.open(imageUrl, '_blank');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      // Validation
      if (!name.trim()) throw new Error('Slab Name is required.');
      if (!selectedCategory) throw new Error('Category is required.');
      if (!selectedSet) throw new Error('Set is required.');
      if (!selectedSubset) throw new Error('Subset is required.');
      if (!selectedGradeCompany) throw new Error('Grading Company is required.');
      if (!gradeScore) throw new Error('Grade Score is required.');
      if (!condition.trim()) throw new Error('Condition is required.');
      if (!language.trim()) throw new Error('Language is required.');
      
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) throw new Error('Price must be a positive number.');
      
      // Check if we have at least one image (existing or new)
      if (existingImageUrls.length === 0 && uploadedMainImageFiles.length === 0) {
        throw new Error('At least one slab image is required.');
      }
      
      // Check if we have a thumbnail
      if (!existingThumbnailUrl && !uploadedThumbnailFile) {
        throw new Error('Thumbnail is required.');
      }

      const slabName = name.trim();
      const baseSlug = slugify(slabName, { lower: true, strict: true, remove: /[*+~.()\'\"!:@]/g });
      const uniqueId = uuidv4().substring(0, 8);
      const finalSlug = slug || `${baseSlug}-${uniqueId}`;

      let finalImageUrls = [...existingImageUrls];
      let finalThumbnailUrl = existingThumbnailUrl;

      // Upload new main images if any
      if (uploadedMainImageFiles.length > 0) {
        for (const uploadedMainImageFile of uploadedMainImageFiles) {
          const now = new Date();
          const year = now.getFullYear();
          const month = (now.getMonth() + 1).toString().padStart(2, '0');
          const day = now.getDate().toString().padStart(2, '0');
          const filePath = `slabs/${year}/${month}/${day}/${uuidv4()}.webp`;
          
          const { error: uploadError } = await supabase.storage
            .from('slabimages')
            .upload(filePath, uploadedMainImageFile, { 
              contentType: uploadedMainImageFile.type,
              upsert: false 
            });
          
          if (uploadError) throw new Error('Failed to upload main image: ' + uploadError.message);
          
          const { data: { publicUrl } } = supabase.storage
            .from('slabimages')
            .getPublicUrl(filePath);
          
          finalImageUrls.push(publicUrl);
        }
      }

      // Upload new thumbnail if provided
      if (uploadedThumbnailFile) {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const thumbFilePath = `slabs/${year}/${month}/${day}/${uuidv4()}_thumb.webp`;

        const { error: thumbUploadError } = await supabase.storage
          .from('slabimages')
          .upload(thumbFilePath, uploadedThumbnailFile, { 
            contentType: uploadedThumbnailFile.type,
            upsert: false 
          });
        
        if (thumbUploadError) throw new Error('Failed to upload thumbnail: ' + thumbUploadError.message);
        
        const { data: { publicUrl: thumbPublicUrl } } = supabase.storage
          .from('slabimages')
          .getPublicUrl(thumbFilePath);
        
        finalThumbnailUrl = thumbPublicUrl;
      }

      // Update slab data
      const slabData = {
        name: slabName,
        slug: finalSlug,
        image_urls: finalImageUrls,
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

      const { error: updateError } = await supabase
        .from('slabs')
        .update(slabData)
        .eq('id', initialSlab.id);

      if (updateError) throw new Error('Failed to update slab: ' + updateError.message);

      // Delete old images that were removed
      if (imagesToDelete.length > 0) {
        for (const imageUrl of imagesToDelete) {
          try {
            const urlPath = new URL(imageUrl).pathname;
            const filePath = urlPath.split('/').slice(-4).join('/'); // Extract the path after bucket name
            await supabase.storage.from('slabimages').remove([filePath]);
          } catch (deleteError) {
            console.warn('Failed to delete old image:', deleteError);
          }
        }
      }

      setSubmitSuccess('Slab updated successfully!');
      
      // Reset states
      setUploadedMainImageFiles([]);
      setUploadedThumbnailFile(null);
      setHasNewImages(false);
      setHasNewThumbnail(false);
      setImagesToDelete([]);
      
      if (onFormSubmitSuccess) onFormSubmitSuccess();

    } catch (err) {
      setSubmitError(err.message);
      console.error("Submit Error Details:", err);
    } finally {
      setFormSubmitLoading(false);
    }
  };

  const ImageWithFallback = ({ src, alt, ...props }) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    if (error) {
      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.1)',
            color: 'text.secondary',
            ...props.sx
          }}
        >
          <Typography variant="caption">Image not found</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
        <Box
          component="img"
          src={src}
          alt={alt}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          sx={{
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.3s',
            ...props.sx
          }}
        />
      </Box>
    );
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
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Edit Slab
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

            {/* Images Section - keeping all existing image functionality */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageIcon color="primary" />
                Images & Thumbnail
              </Typography>

              {/* Current images display */}
              {existingImageUrls.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                    Current Images:
                  </Typography>
                  <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={existingImageUrls}
                      strategy={horizontalListSortingStrategy}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 2
                      }}>
                        {existingImageUrls.map((url, index) => (
                          <DraggableImageItem
                            key={url}
                            id={url}
                            url={url}
                            index={index}
                            isThumbnail={url === existingThumbnailUrl}
                            onSetAsThumbnail={handleSetAsThumbnail}
                            onRemoveImage={handleRemoveImage}
                            onPreviewImage={handleOpenPreview}
                            onCropImage={handleCropImage}
                          />
                        ))}
                      </Box>
                    </SortableContext>
                  </DndContext>
                </Box>
              )}

              {/* Upload new images */}
              <Alert severity="info" sx={{ mb: 2 }}>
                Upload new images to replace or add to the current ones (optional)
              </Alert>

              <ImageUpload 
                bucketName="slabimages" 
                pathPrefix="slabs" 
                onUploadComplete={handleImageUploadComplete}
              />
              
              {uploadedMainImageFiles.length > 0 && (
                <Fade in={true}>
                  <Alert 
                    severity="success" 
                    sx={{ mt: 2 }}
                    icon={<CheckCircleOutlineIcon />}
                  >
                    {uploadedMainImageFiles.length} new image(s) ready to upload.
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
                {formSubmitLoading ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      )}

      {/* Image Cropper Modal - updated for full-screen precision cropping */}
      <Modal
        open={showCropper}
        onClose={handleCloseCropper}
        aria-labelledby="crop-image-modal"
        aria-describedby="modal-to-crop-card-image"
      >
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1300,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: 'background.paper'
          }}>
            <Typography id="crop-image-modal" variant="h6" component="h2">
              Crop Image
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                onClick={handleCloseCropper}
                disabled={formSubmitLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSaveCrop}
                disabled={formSubmitLoading}
                startIcon={formSubmitLoading ? <CircularProgress size={20} /> : <CropIcon />}
              >
                {formSubmitLoading ? 'Saving...' : 'Save Crop'}
              </Button>
            </Box>
          </Box>

          {/* Cropper Area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            {cropperImage && (
              <Box sx={{ 
                flex: 1, 
                minHeight: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  height: '100%',
                  width: '100%',
                  maxHeight: 'calc(100vh - 80px)', // Account for header
                  position: 'relative'
                }}>
                  <Cropper
                    ref={cropperRef}
                    src={cropperImage}
                    className="cropper"
                    stencilProps={{
                      movable: true,
                      resizable: true
                    }}
                    stencilComponent={RectangleStencil}
                    defaultSize={{ width: '95%', height: '95%' }}
                    style={{ height: '100%', width: '100%' }}
                  />
                </Box>
              </Box>
            )}
            {formSubmitLoading && (
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 2 }}>
                  <CircularProgress />
                  <Typography sx={{ ml: 1 }}>Processing...</Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
} 