'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import { useToast } from '@/components/UI/Toast';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
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
import SortableItem from '@/components/UI/SortableItem';
import Link from 'next/link';
import styles from '../Forms/Forms.module.css';

export default function EditSlabForm({ slab, categories, sets, subsets, gradeCompanies, onSuccess }) {
  const supabase = createClient();
  const { showToast } = useToast();

  // Early return if slab is not loaded yet
  if (!slab) {
    return (
      <div className={styles.formContainer} style={{ textAlign: 'center' }}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Loading slab data...</span>
        </div>
      </div>
    );
  }

  const [name, setName] = useState(slab.name || '');
  const [selectedCategory, setSelectedCategory] = useState(slab.category_id || '');
  const [selectedSet, setSelectedSet] = useState(slab.set_id || '');
  const [selectedSubset, setSelectedSubset] = useState(slab.subset_id || '');
  const [selectedGradeCompany, setSelectedGradeCompany] = useState(slab.grade_company_id || '');
  const [gradeScore, setGradeScore] = useState(slab.grade_score || '');
  const [condition, setCondition] = useState(slab.condition || 'perfect');
  const [language, setLanguage] = useState(slab.language || 'Japanese');
  const [price, setPrice] = useState(slab.price ? slab.price.toString() : '');

  // Data state
  const [availableGrades, setAvailableGrades] = useState([]);

  // Image state
  const [existingImageUrls, setExistingImageUrls] = useState(slab.image_urls || []);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState(slab.thumbnail_url || '');
  const [newImages, setNewImages] = useState([]);
  const [newThumbnailFile, setNewThumbnailFile] = useState(null);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [resetImageUploadKey, setResetImageUploadKey] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update available grades when grade company changes
  useEffect(() => {
    if (selectedGradeCompany && gradeCompanies) {
      const company = gradeCompanies.find(gc => gc.id === selectedGradeCompany);
      setAvailableGrades(company ? company.grades || [] : []);
      if (!gradeScore) {
        setGradeScore(''); // Reset grade score if it's not already set
      }
    } else {
      setAvailableGrades([]);
      setGradeScore('');
    }
  }, [selectedGradeCompany, gradeCompanies, gradeScore]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setExistingImageUrls((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleImageUploadComplete = (data) => {
    const { mainImageFiles, thumbnailImageFile } = data;
    setNewImages(mainImageFiles || []);
    setNewThumbnailFile(thumbnailImageFile || null);
  };

  const handleDeleteExistingImage = (imageUrl) => {
    setExistingImageUrls(prev => prev.filter(url => url !== imageUrl));
    setImagesToDelete(prev => [...prev, imageUrl]);
    
    // If deleted image was thumbnail, clear it
    if (imageUrl === existingThumbnailUrl) {
      setExistingThumbnailUrl('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Validation
    if (!name.trim()) {
      showToast('Slab Name is required.', { severity: 'error' });
      setLoading(false);
      return;
    }
    if (existingImageUrls.length === 0 && newImages.length === 0) {
      showToast('At least one image is required.', { severity: 'error' });
      setLoading(false);
      return;
    }
    if (!existingThumbnailUrl && !newThumbnailFile) {
      showToast('Thumbnail is required.', { severity: 'error' });
      setLoading(false);
      return;
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      showToast('Price must be a positive number.', { severity: 'error' });
      setLoading(false);
      return;
    }

    try {
      const slabName = name.trim();
      const baseSlug = slugify(slabName, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
      const uniqueId = uuidv4().substring(0, 8);
      const finalSlug = `${baseSlug}-${uniqueId}`;

      let uploadedNewImageUrls = [];
      let finalThumbnailUrl = existingThumbnailUrl;

      // Upload new main images
      for (const file of newImages) {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const filePath = `slabs/${year}/${month}/${day}/${uuidv4()}.webp`;
        
        const { error: uploadError } = await supabase.storage
          .from('slabimages')
          .upload(filePath, file, { contentType: file.type, upsert: false });
        if (uploadError) throw new Error(`Failed to upload image: ${uploadError.message}`);
        
        const { data: { publicUrl } } = supabase.storage.from('slabimages').getPublicUrl(filePath);
        uploadedNewImageUrls.push(publicUrl);
      }

      // Upload new thumbnail if provided
      if (newThumbnailFile) {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const thumbFilePath = `slabs/${year}/${month}/${day}/${uuidv4()}_thumb.webp`;

        const { error: thumbUploadError } = await supabase.storage
          .from('slabimages')
          .upload(thumbFilePath, newThumbnailFile, { contentType: newThumbnailFile.type, upsert: false });
        if (thumbUploadError) throw new Error(`Failed to upload thumbnail: ${thumbUploadError.message}`);
        const { data: { publicUrl: thumbPublicUrl } } = supabase.storage.from('slabimages').getPublicUrl(thumbFilePath);
        finalThumbnailUrl = thumbPublicUrl;
      }

      // Combine existing and new image URLs
      const allImageUrls = [...existingImageUrls, ...uploadedNewImageUrls];

      const slabData = {
        name: slabName,
        slug: finalSlug,
        image_urls: allImageUrls,
        thumbnail_url: finalThumbnailUrl,
        category_id: selectedCategory,
        set_id: selectedSet || null,
        subset_id: selectedSubset || null,
        grade_company_id: selectedGradeCompany || null,
        grade_score: gradeScore || null,
        condition: condition.trim() || null,
        language: language.trim() || null,
        price: parseFloat(price) || null,
      };

      const { error: updateError } = await supabase
        .from('slabs')
        .update(slabData)
        .eq('id', slab.id);

      if (updateError) throw new Error(`Failed to update slab: ${updateError.message}`);

      // Show success toast notification
      showToast('Slab updated successfully!', { 
        severity: 'success',
        title: 'Success'
      });

      // Delete old images that were removed
      if (imagesToDelete.length > 0) {
        for (const imageUrl of imagesToDelete) {
          try {
            const urlPath = new URL(imageUrl).pathname;
            const filePath = urlPath.split('/').slice(-4).join('/');
            await supabase.storage.from('slabimages').remove([filePath]);
          } catch (deleteError) {
            console.warn('Failed to delete old image:', deleteError);
          }
        }
      }

      // Success handling
      setSuccessMessage('Slab updated successfully!');
      
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
      console.error('Error updating slab:', error);
      const errorMessage = error.message || 'An unexpected error occurred while updating the slab.';
      showToast(errorMessage, { 
        severity: 'error',
        title: 'Error' 
      });
    } finally {
      setLoading(false);
    }
  };

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
                <option value="scratched">Scratched</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grading Information Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <h2 className={styles.sectionTitle}>Grading Information</h2>
          </div>
          
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="gradeCompany">
                Grading Company <span className={styles.required}>*</span>
              </label>
              <select
                id="gradeCompany"
                className={styles.select}
                value={selectedGradeCompany}
                onChange={(e) => setSelectedGradeCompany(e.target.value)}
                required
              >
                <option value="">Select Grading Company</option>
                {(gradeCompanies || []).map((gc) => (
                  <option key={gc.id} value={gc.id}>{gc.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="gradeScore">
                Grade Score <span className={styles.required}>*</span>
              </label>
              <select
                id="gradeScore"
                className={styles.select}
                value={gradeScore}
                onChange={(e) => setGradeScore(e.target.value)}
                disabled={!selectedGradeCompany || availableGrades.length === 0}
                required
              >
                <option value="">Select Grade Score</option>
                {availableGrades.map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
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
              >
                <option value="">Select Set</option>
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
              >
                <option value="">Select Subset</option>
                {(subsets || []).map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name} - {sub.slug}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Existing Images Section */}
        {existingImageUrls.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg className={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className={styles.sectionTitle}>Current Images</h2>
            </div>

            <div className={styles.infoAlert}>
              Drag and drop images to reorder them. Click actions to delete images.
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={existingImageUrls} strategy={horizontalListSortingStrategy}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(11.25rem, 1fr))', 
                  gap: '1rem', 
                  marginTop: '1rem' 
                }}>
                  {existingImageUrls.map((imageUrl) => (
                    <SortableItem
                      key={imageUrl}
                      id={imageUrl}
                      imageUrl={imageUrl}
                      isThumbnail={false}
                      onDelete={handleDeleteExistingImage}
                      onSetThumbnail={() => {}} // Empty function since we're not using this
                      style={{
                        width: '11.25rem',
                        height: 'auto',
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Current Thumbnail Section */}
        {existingThumbnailUrl && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg className={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 0 0 14-14 0zm7 3l-2 0 0 2 2 0zm0 4l-2 0 0 2 2 0z" />
              </svg>
              <h2 className={styles.sectionTitle}>Current Thumbnail</h2>
            </div>

            <div className={styles.infoAlert}>
              This is the current thumbnail image that represents this slab.
            </div>

            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1rem'
            }}>
              <div style={{
                width: '11.25rem',
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '3px solid var(--primary-color)',
                backgroundColor: 'var(--section-bg)',
              }}>
                <img
                  src={existingThumbnailUrl}
                  alt="Current Thumbnail"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    minHeight: '200px',
                    objectFit: 'contain',
                    backgroundColor: 'var(--hover-bg)',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  zIndex: 2,
                }}>
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  THUMBNAIL
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add New Images Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <h2 className={styles.sectionTitle}>Add New Images</h2>
          </div>

          <div className={styles.infoAlert}>
            Upload additional images for your slab. New images will be added to existing ones.
          </div>

          <div className={styles.imageSection}>
            <ImageUpload
              bucketName="slabimages"
              pathPrefix="slabs"
              onUploadComplete={handleImageUploadComplete}
              resetKey={resetImageUploadKey}
            />
          </div>
          
          {newImages.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-color)', borderRadius: '6px', color: 'var(--success-color)' }}>
              {newImages.length} new image(s) ready to upload.
              {newThumbnailFile 
                ? ' New thumbnail will replace current one.' 
                : ''}
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
                Updating Slab...
              </div>
            ) : (
              <>
                <svg className={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Update Slab
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 