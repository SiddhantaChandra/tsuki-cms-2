'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/UI/Toast';
import { v4 as uuidv4 } from 'uuid';
import ImageUpload from '@/components/ImageUpload/ImageUpload';
import Link from 'next/link';
import styles from '../Forms/Forms.module.css';

export default function NewAccessoryForm({ categories }) {
  const supabase = createClient();
  const router = useRouter();
  const { showToast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [accessoryType, setAccessoryType] = useState('');

  // Image state
  const [mainImages, setMainImages] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [resetImageUploadKey, setResetImageUploadKey] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState({});

  // Auto-generate slug from name
  useEffect(() => {
    if (name.trim()) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlug(generatedSlug);
    }
  }, [name]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!slug.trim()) newErrors.slug = 'Slug is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!categoryId) newErrors.categoryId = 'Category is required';
    if (!price || parseFloat(price) <= 0) newErrors.price = 'Valid price is required';
    if (!stock || parseInt(stock) < 0) newErrors.stock = 'Valid stock is required';
    if (!accessoryType.trim()) newErrors.accessoryType = 'Accessory type is required';
    if (mainImages.length === 0) newErrors.images = 'At least one image is required';
    if (!thumbnailFile) newErrors.thumbnail = 'Thumbnail is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUploadComplete = (data) => {
    const { mainImageFiles, thumbnailImageFile } = data;
    setMainImages(mainImageFiles || []);
    setThumbnailFile(thumbnailImageFile || null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      showToast("Please correct the errors in the form.", { severity: 'error' });
      return;
    }

    setLoading(true);

    try {
      // Upload main images
      const imageUrls = [];
      for (const image of mainImages) {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const imagePath = `accessories/${year}/${month}/${day}/${uuidv4()}.webp`;
        
        const { error: uploadError } = await supabase.storage
          .from('accessoryimages')
          .upload(imagePath, image, { contentType: image.type });
        
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
        
        const { data: { publicUrl } } = supabase.storage
          .from('accessoryimages')
          .getPublicUrl(imagePath);
        imageUrls.push(publicUrl);
      }

      // Upload thumbnail
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const thumbnailPath = `accessories/${year}/${month}/${day}/${uuidv4()}_thumb.webp`;
        
        const { error: thumbnailUploadError } = await supabase.storage
          .from('accessoryimages')
          .upload(thumbnailPath, thumbnailFile, { contentType: thumbnailFile.type });
        
        if (thumbnailUploadError) throw new Error(`Thumbnail upload failed: ${thumbnailUploadError.message}`);
        
        const { data: { publicUrl: thumbPublicUrl } } = supabase.storage
          .from('accessoryimages')
          .getPublicUrl(thumbnailPath);
        thumbnailUrl = thumbPublicUrl;
      }

      // Insert accessory data
      const accessoryData = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        category_id: categoryId,
        price: parseFloat(price),
        stock: parseInt(stock),
        accessory_type: accessoryType.trim(),
        image_urls: imageUrls,
        thumbnail_url: thumbnailUrl,
      };

      const { error: insertError } = await supabase
        .from('accessories')
        .insert(accessoryData);

      if (insertError) throw new Error(`Database insert failed: ${insertError.message}`);

      // Show success toast notification
      showToast('Accessory added successfully!', { 
        severity: 'success',
        title: 'Success'
      });

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
      }, 1500);

    } catch (error) {
      console.error('Error creating accessory:', error);
      const errorMessage = error.message || 'An unexpected error occurred.';
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
              <label className={styles.label} htmlFor="accessoryName">
                Accessory Name <span className={styles.required}>*</span>
              </label>
              <input
                id="accessoryName"
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter accessory name"
                required
              />
              {errors.name && <div className={styles.errorText}>{errors.name}</div>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="slug">
                Slug <span className={styles.required}>*</span>
              </label>
              <input
                id="slug"
                type="text"
                className={`${styles.input} ${errors.slug ? styles.inputError : ''}`}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-from-name"
                required
              />
              {errors.slug && <div className={styles.errorText}>{errors.slug}</div>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="description">
                Description <span className={styles.required}>*</span>
              </label>
              <textarea
                id="description"
                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter accessory description"
                rows={4}
                required
              />
              {errors.description && <div className={styles.errorText}>{errors.description}</div>}
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="category">
                  Category <span className={styles.required}>*</span>
                </label>
                <select
                  id="category"
                  className={`${styles.select} ${errors.categoryId ? styles.inputError : ''}`}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {(categories || []).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <div className={styles.errorText}>{errors.categoryId}</div>}
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="accessoryType">
                  Accessory Type <span className={styles.required}>*</span>
                </label>
                <input
                  id="accessoryType"
                  type="text"
                  className={`${styles.input} ${errors.accessoryType ? styles.inputError : ''}`}
                  value={accessoryType}
                  onChange={(e) => setAccessoryType(e.target.value)}
                  placeholder="e.g., Card Sleeve, Deck Box"
                  required
                />
                {errors.accessoryType && <div className={styles.errorText}>{errors.accessoryType}</div>}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="price">
                  Price <span className={styles.required}>*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
                {errors.price && <div className={styles.errorText}>{errors.price}</div>}
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="stock">
                  Stock Quantity <span className={styles.required}>*</span>
                </label>
                <input
                  id="stock"
                  type="number"
                  className={`${styles.input} ${errors.stock ? styles.inputError : ''}`}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  placeholder="0"
                  required
                />
                {errors.stock && <div className={styles.errorText}>{errors.stock}</div>}
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
            Upload clear images of your accessory. At least one image and a thumbnail are required.
          </div>

          <div className={styles.imageSection}>
            <ImageUpload
              bucketName="accessoryimages"
              pathPrefix="accessories"
              onUploadComplete={handleImageUploadComplete}
              resetKey={resetImageUploadKey}
            />
          </div>
          
          {errors.images && <div className={styles.errorText}>{errors.images}</div>}
          {errors.thumbnail && <div className={styles.errorText}>{errors.thumbnail}</div>}
          
          {mainImages.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-color)', borderRadius: '6px', color: 'var(--success-color)' }}>
              {mainImages.length} image(s) ready.
              {thumbnailFile 
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
                Adding Accessory...
              </div>
            ) : (
              <>
                <svg className={styles.sectionIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Add Accessory to Collection
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 