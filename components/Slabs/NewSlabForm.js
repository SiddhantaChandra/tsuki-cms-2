'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import { useToast } from '@/components/UI/Toast';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import Link from 'next/link';
import styles from '../Forms/Forms.module.css';

export default function NewSlabForm({ 
  categoriesExternal, 
  initialCategories,
  setsExternal, 
  subsetsExternal, 
  gradeCompaniesExternal, 
  loadingCategoriesExternal, 
  categoryErrorExternal,
  onFormSubmitSuccess 
}) {
  const supabase = createClient();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSet, setSelectedSet] = useState('');
  const [selectedSubset, setSelectedSubset] = useState('');
  const [selectedGradeCompany, setSelectedGradeCompany] = useState('');
  const [gradeScore, setGradeScore] = useState('');
  const [condition, setCondition] = useState('perfect');
  const [language, setLanguage] = useState('Japanese');
  const [price, setPrice] = useState('');

  // Data state
  const [categories, setCategories] = useState([]);
  const [sets, setSets] = useState([]);
  const [subsets, setSubsets] = useState([]);
  const [gradeCompanies, setGradeCompanies] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);

  // Loading states
  const [loadingSets, setLoadingSets] = useState(false);
  const [loadingSubsets, setLoadingSubsets] = useState(false);
  const [loadingGradeCompanies, setLoadingGradeCompanies] = useState(true);

  // UI state
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [resetImageUploadKey, setResetImageUploadKey] = useState(0);

  // Image state
  const [uploadedMainImageFiles, setUploadedMainImageFiles] = useState([]);
  const [uploadedThumbnailFile, setUploadedThumbnailFile] = useState(null);

  const imageUploadRef = useRef(null);

  // Initialize categories from props
  useEffect(() => {
    const cats = categoriesExternal || initialCategories || [];
    setCategories(cats);
  }, [categoriesExternal, initialCategories]);

  // Fetch sets when category changes
  useEffect(() => {
    if (selectedCategory) {
      const fetchSets = async () => {
        setLoadingSets(true);
        setSets([]);
        setSelectedSet('');
        setSubsets([]);
        setSelectedSubset('');
        
        const { data, error } = await supabase
          .from('sets')
          .select('id, name')
          .eq('category_id', selectedCategory);
        
        if (error) {
          console.error('Failed to load sets:', error);
          showToast('Failed to load sets', { severity: 'error' });
        } else {
          setSets(data || []);
        }
        setLoadingSets(false);
      };
      fetchSets();
    } else {
      setSets([]);
      setSelectedSet('');
      setSubsets([]);
      setSelectedSubset('');
    }
  }, [selectedCategory, supabase, showToast]);

  // Fetch subsets when set changes
  useEffect(() => {
    if (selectedSet) {
      const fetchSubsets = async () => {
        setLoadingSubsets(true);
        setSubsets([]);
        setSelectedSubset('');
        
        const { data, error } = await supabase
          .from('subsets')
          .select('id, name, slug, release_date')
          .eq('set_id', selectedSet);
        
        if (error) {
          console.error('Failed to load subsets:', error);
          showToast('Failed to load subsets', { severity: 'error' });
        } else {
          // Sort subsets by release date (newest first)
          const sortedSubsets = [...(data || [])].sort((a, b) => {
            if (a.release_date && b.release_date) {
              return new Date(b.release_date) - new Date(a.release_date);
            } else if (a.release_date) return -1;
            else if (b.release_date) return 1;
            else return 0;
          });
          setSubsets(sortedSubsets);
        }
        setLoadingSubsets(false);
      };
      fetchSubsets();
    } else {
      setSubsets([]);
      setSelectedSubset('');
    }
  }, [selectedSet, supabase, showToast]);

  // Fetch grade companies
  useEffect(() => {
    const fetchGradeCompanies = async () => {
      setLoadingGradeCompanies(true);
      const { data, error } = await supabase
        .from('grade_companies')
        .select('id, name, grades');
      
      if (error) {
        console.error('Failed to load grade companies:', error);
        showToast('Failed to load grade companies', { severity: 'error' });
      } else {
        setGradeCompanies(data || []);
      }
      setLoadingGradeCompanies(false);
    };
    fetchGradeCompanies();
  }, [supabase, showToast]);

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
    console.log('[NewSlabForm] handleImageUploadComplete called:', data);
    const { mainImageFiles, thumbnailImageFile } = data;
    setUploadedMainImageFiles(mainImageFiles || []);
    setUploadedThumbnailFile(thumbnailImageFile || null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    // Validation
    if (!name.trim()) { 
      setSubmitError('Slab Name is required.'); 
      showToast('Slab Name is required.', { severity: 'error' });
      setFormSubmitLoading(false); 
      return; 
    }
    if (uploadedMainImageFiles.length === 0) { 
      setSubmitError('At least one slab image is required.'); 
      showToast('At least one slab image is required.', { severity: 'error' });
      setFormSubmitLoading(false); 
      return; 
    }
    if (!uploadedThumbnailFile) { 
      setSubmitError('Thumbnail is required. Please use the "Make Thumb" button on one of the images.'); 
      showToast('Thumbnail is required.', { severity: 'error' });
      setFormSubmitLoading(false); 
      return; 
    }
    if (!selectedCategory) { 
      setSubmitError('Category is required.'); 
      showToast('Category is required.', { severity: 'error' });
      setFormSubmitLoading(false); 
      return; 
    }
    if (!selectedSet) { 
      setSubmitError('Set is required.'); 
      showToast('Set is required.', { severity: 'error' });
      setFormSubmitLoading(false); 
      return; 
    }
    if (!selectedSubset) { 
      setSubmitError('Subset is required.'); 
      showToast('Subset is required.', { severity: 'error' });
      setFormSubmitLoading(false); 
      return; 
    }
    if (!selectedGradeCompany) { 
      setSubmitError('Grade Company is required.'); 
      showToast('Grade Company is required.', { severity: 'error' });
      setFormSubmitLoading(false); 
      return; 
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) { 
      setSubmitError('Price must be a positive number.'); 
      showToast('Price must be a positive number.', { severity: 'error' });
      setFormSubmitLoading(false); 
      return; 
    }

    try {
      const slabName = name.trim();
      const baseSlug = slugify(slabName, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
      const uniqueId = uuidv4().substring(0, 8);
      const finalSlug = `${baseSlug}-${uniqueId}`;

      const uploadedImageUrls = [];
      let finalThumbnailUrl = null;

      // Upload main images
      for (const file of uploadedMainImageFiles) {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const filePath = `slabs/${year}/${month}/${day}/${uuidv4()}.webp`;
        
        const { error: uploadError } = await supabase.storage
          .from('slabimages')
          .upload(filePath, file, { contentType: file.type, upsert: false });
        if (uploadError) throw new Error(`Failed to upload main image ${file.name}: ${uploadError.message}`);
        
        const { data: { publicUrl } } = supabase.storage.from('slabimages').getPublicUrl(filePath);
        uploadedImageUrls.push(publicUrl);
      }

      // Upload thumbnail
      if (uploadedThumbnailFile) {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const thumbFilePath = `slabs/${year}/${month}/${day}/${uuidv4()}_thumb.webp`;

        const { error: thumbUploadError } = await supabase.storage
          .from('slabimages')
          .upload(thumbFilePath, uploadedThumbnailFile, { contentType: uploadedThumbnailFile.type, upsert: false });
        if (thumbUploadError) throw new Error(`Failed to upload thumbnail: ${thumbUploadError.message}`);
        const { data: { publicUrl: thumbPublicUrl } } = supabase.storage.from('slabimages').getPublicUrl(thumbFilePath);
        finalThumbnailUrl = thumbPublicUrl;
      }

      const slabData = {
        name: slabName,
        slug: finalSlug,
        image_urls: uploadedImageUrls,
        thumbnail_url: finalThumbnailUrl,
        category_id: selectedCategory,
        set_id: selectedSet || null,
        subset_id: selectedSubset || null,
        grade_company_id: selectedGradeCompany || null,
        grade_score: gradeScore ? gradeScore : null,
        condition: condition.trim() || null,
        language: language.trim() || null,
        price: parseFloat(price) || null,
      };

      const { error: insertError } = await supabase.from('slabs').insert(slabData);
      if (insertError) throw new Error('Failed to insert slab: ' + insertError.message);

      // Show success toast notification
      showToast('Slab added successfully!', { 
        severity: 'success',
        title: 'Success'
      });

      setSubmitSuccess('Slab added successfully!');
      // Reset form fields
      setName(''); setSelectedCategory(''); setSelectedSet(''); setSelectedSubset('');
      setSelectedGradeCompany(''); setGradeScore(''); setCondition('perfect'); setLanguage('Japanese'); setPrice('');
      setUploadedMainImageFiles([]); setUploadedThumbnailFile(null);
      // Reset ImageUpload component internal state
      if (imageUploadRef.current && imageUploadRef.current.reset) {
        imageUploadRef.current.reset();
      }
      setResetImageUploadKey(prevKey => prevKey + 1);

      if (onFormSubmitSuccess) onFormSubmitSuccess();

    } catch (error) {
      console.error('Error creating slab:', error);
      const errorMessage = error.message || 'An unexpected error occurred while creating the slab.';
      setSubmitError(errorMessage);
      showToast(errorMessage, { 
        severity: 'error',
        title: 'Error' 
      });
    } finally {
      setFormSubmitLoading(false);
    }
  };

  if (loadingCategoriesExternal) {
    return (
      <div className={styles.formContainer} style={{ textAlign: 'center' }}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Loading form data...</span>
        </div>
      </div>
    );
  }

  if (categoryErrorExternal) {
    return (
      <div className={styles.formContainer}>
        <div style={{ color: 'var(--error-color)', padding: '1rem', backgroundColor: 'var(--error-bg)', borderRadius: '6px', border: '1px solid var(--error-color)' }}>
          {typeof categoryErrorExternal === 'string' ? categoryErrorExternal : 'An error occurred while loading essential data for the form.'}
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
              <label className={styles.label} htmlFor="slabName">
                Slab Name <span className={styles.required}>*</span>
              </label>
              <input
                id="slabName"
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter slab name"
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
                <option value="perfect">Perfect</option>
                <option value="near-perfect">Near Perfect</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
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
                disabled={loadingCategoriesExternal}
              >
                <option value="">
                  {loadingCategoriesExternal ? 'Loading categories...' : 'Select Category'}
                </option>
                {(categories || []).map((cat) => (
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
                required
                disabled={!selectedCategory || loadingSets}
              >
                <option value="">
                  {!selectedCategory 
                    ? 'Select Category first' 
                    : loadingSets 
                      ? 'Loading sets...' 
                      : 'Select Set'}
                </option>
                {(sets || []).map((s) => (
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
                required
                disabled={!selectedSet || loadingSubsets}
              >
                <option value="">
                  {!selectedSet 
                    ? 'Select Set first' 
                    : loadingSubsets 
                      ? 'Loading subsets...' 
                      : 'Select Subset'}
                </option>
                {(subsets || []).map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name} - {sub.slug}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grading Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <h2 className={styles.sectionTitle}>Grading Information</h2>
          </div>
          
          <div className={styles.fieldGroup}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="gradeCompany">
                  Grade Company <span className={styles.required}>*</span>
                </label>
                <select
                  id="gradeCompany"
                  className={styles.select}
                  value={selectedGradeCompany}
                  onChange={(e) => setSelectedGradeCompany(e.target.value)}
                  required
                  disabled={loadingGradeCompanies}
                >
                  <option value="">
                    {loadingGradeCompanies ? 'Loading grade companies...' : 'Select Grade Company'}
                  </option>
                  {(gradeCompanies || []).map((company) => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="gradeScore">
                  Grade Score
                </label>
                <select
                  id="gradeScore"
                  className={styles.select}
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                  disabled={!selectedGradeCompany || availableGrades.length === 0}
                >
                  <option value="">
                    {!selectedGradeCompany 
                      ? 'Select Grade Company first' 
                      : availableGrades.length === 0 
                        ? 'No grades available' 
                        : 'Select Grade (Optional)'}
                  </option>
                  {availableGrades.map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
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
            Upload clear images of your slab. At least one image and a thumbnail are required.
          </div>

          <div className={styles.imageSection}>
            <ImageUpload
              ref={imageUploadRef}
              bucketName="slabimages"
              pathPrefix="slabs"
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
            disabled={formSubmitLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
            disabled={formSubmitLoading}
          >
            {formSubmitLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                Adding Slab...
              </div>
            ) : (
              <>
                <svg className={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Add Slab to Collection
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 