'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import { useToast } from '@/components/UI/Toast';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import Link from 'next/link';
import styles from '../Forms/Forms.module.css';

export default function NewCardForm({ initialCategories, onFormSubmitSuccess, loadingCategories, categoryError }) {
  console.log('[NewCardForm] Function body execution (render start). LoadingCategories:', loadingCategories, 'CategoryError:', categoryError);
  const supabase = createClient();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSet, setSelectedSet] = useState('');
  const [selectedSubset, setSelectedSubset] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('10'); 
  const [language, setLanguage] = useState('Japanese'); 

  // Data state
  const [categories, setCategories] = useState(initialCategories || []);
  const [sets, setSets] = useState([]);
  const [subsets, setSubsets] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [resetImageUploadKey, setResetImageUploadKey] = useState(0);

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
      setCondition('10'); // Reset to Gem Mint (default)
      setLanguage('Japanese'); // Reset to Japanese (default)
      
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
      <div className={styles.formContainer} style={{ textAlign: 'center' }}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Loading form data...</span>
        </div>
      </div>
    );
  }

  if (categoryError) {
    return (
      <div className={styles.formContainer}>
        <div style={{ color: 'var(--error-color)', padding: '1rem', backgroundColor: 'var(--error-bg)', borderRadius: '6px', border: '1px solid var(--error-color)' }}>
          {typeof categoryError === 'string' ? categoryError : 'An error occurred while loading essential data for the form.'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Information Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className={styles.sectionTitle}>Basic Information</h2>
          </div>
          
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="cardName">
                Card Name <span className={styles.required}>*</span>
              </label>
              <input
                id="cardName"
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter card name"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="price">
                  Price <span className={styles.required}>*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  className={styles.input}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="language">
                  Language <span className={styles.required}>*</span>
                </label>
                <select
                  id="language"
                  className={styles.select}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  <option value="Japanese">Japanese</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="condition">
                Condition <span className={styles.required}>*</span>
              </label>
              <select
                id="condition"
                className={styles.select}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              >
                <option value="10">Gem Mint</option>
                <option value="9">Mint</option>
                <option value="8">Near Mint</option>
                <option value="7">Excellent</option>
                <option value="6">Good</option>
                <option value="5">Fair</option>
                <option value="4">Poor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Classification Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className={styles.sectionTitle}>Classification</h2>
          </div>
          
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="category">
                Category <span className={styles.required}>*</span>
              </label>
              <select
                id="category"
                className={styles.select}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="set">
                Set <span className={styles.required}>*</span>
              </label>
              <select
                id="set"
                className={styles.select}
                value={selectedSet}
                onChange={(e) => setSelectedSet(e.target.value)}
                disabled={!selectedCategory}
                required
              >
                <option value="">Select Set</option>
                {sets.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="subset">
                Subset <span className={styles.required}>*</span>
              </label>
              <select
                id="subset"
                className={styles.select}
                value={selectedSubset}
                onChange={(e) => setSelectedSubset(e.target.value)}
                disabled={!selectedSet}
                required
              >
                <option value="">Select Subset</option>
                {subsets.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name} - {sub.slug}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className={styles.sectionTitle}>Images & Thumbnail</h2>
          </div>

          <div className={styles.infoAlert}>
            Upload clear images of your card. At least one image and a thumbnail are required.
          </div>

          <div className={styles.imageSection}>
            <ImageUpload
              bucketName="cardimages"
              pathPrefix="cards"
              onUploadComplete={handleImageUploadComplete}
              resetKey={resetImageUploadKey}
            />
          </div>
          
          {uploadedMainImageFiles.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-color)', borderRadius: '6px', color: 'var(--success-color)' }}>
              {uploadedMainImageFiles.length} image(s) ready.
              {uploadedThumbnailFile 
                ? ' Thumbnail is set.' 
                : ' Please select a thumbnail using the "Make Thumb" button.'}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
            disabled={loading}
          >
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                Adding Card...
              </div>
            ) : (
              <>
                <svg className={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Add Card to Collection
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 