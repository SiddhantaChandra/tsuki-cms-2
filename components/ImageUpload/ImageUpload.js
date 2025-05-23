'use client';

import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import { Cropper, RectangleStencil } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import imageCompression from 'browser-image-compression';

const Input = styled('input')({
  display: 'none',
});

const PreviewImage = styled('img')({
  width: '100%',
  height: 'auto',
  maxHeight: '180px',
  objectFit: 'cover',
  borderRadius: '4px',
});

const ThumbnailPreviewImage = styled('img')({
  width: '240px',
  height: '320px',
  objectFit: 'cover',
  borderRadius: '4px',
  border: '1px solid #ccc',
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 700,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxHeight: '95vh',
  overflowY: 'auto',
};

// Utility function to convert an image file to WebP
async function convertToWebP(imageFile, targetWidth, targetHeight) {
  // Create a new function for generating a properly sized image with exact dimensions
  const createResizedImage = async (file, targetWidth, targetHeight) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas with the exact target dimensions
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        
        // Calculate source dimensions to maintain 3:4 aspect ratio
        let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
        
        // Determine crop area based on aspect ratio
        const targetAspect = targetWidth / targetHeight;
        if (sourceWidth / sourceHeight > targetAspect) {
          // Image is wider than target aspect ratio, crop sides
          sourceWidth = sourceHeight * targetAspect;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // Image is taller than target aspect ratio, crop top/bottom
          sourceHeight = sourceWidth / targetAspect;
          sourceY = (img.height - sourceHeight) / 2;
        }
        
        // Draw the cropped image onto the canvas, resized to target dimensions
        ctx.drawImage(
          img, 
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, targetWidth, targetHeight
        );
        
        // Convert to blob
        canvas.toBlob(blob => {
          if (!blob) {
            reject(new Error('Failed to create blob from canvas'));
            return;
          }
          const resizedFile = new File([blob], file.name, { type: 'image/png' });
          resolve(resizedFile);
        }, 'image/png', 1.0);
      };
      
      img.onerror = () => reject(new Error('Failed to load image for resizing'));
      img.src = URL.createObjectURL(file);
    });
  };

  try {
    // First create a properly sized 900x1200 image (maintain 3:4 ratio)
    console.log(`Original file size: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB, type: ${imageFile.type}`);
    const resizedImageFile = await createResizedImage(imageFile, targetWidth, targetHeight);
    
    // Then compress to WebP format for better file size
    const options = {
      maxSizeMB: 1.5, 
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: 0.85,
    };
    
    const compressedFile = await imageCompression(resizedImageFile, options);
    console.log(`Compressed WebP file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Create a new File object with the .webp extension
    const webpFileName = imageFile.name.substring(0, imageFile.name.lastIndexOf('.') || imageFile.name.length) + '.webp';
    return new File([compressedFile], webpFileName, { type: 'image/webp' });
  } catch (error) {
    console.error('Error converting to WebP:', error);
    throw error; // Rethrow to allow caller to handle (e.g. show error to user)
  }
}

// Utility function to get a cropped image File
async function getCroppedImg(imageSrcOrCanvas, pixelCrop, fileName) {
  if (imageSrcOrCanvas instanceof HTMLCanvasElement) {
    // If we get a canvas directly (from react-advanced-cropper)
    return new Promise((resolve, reject) => {
      imageSrcOrCanvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty for direct blob conversion');
          reject(new Error('Canvas is empty during blob conversion'));
          return;
        }
        resolve(new File([blob], fileName, { type: blob.type || 'image/png' }));
      }, 'image/png', 1); // Output as PNG from canvas before WebP conversion by caller
    });
  } else {
    // Original path for react-image-crop (might be removed later)
    const image = new Image();
    image.src = imageSrcOrCanvas;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty for cropping');
          reject(new Error('Canvas is empty during crop'));
          return;
        }
        resolve(new File([blob], fileName, { type: blob.type || 'image/png' }));
      }, 'image/png', 1);
    });
  }
}

const ImageUpload = React.forwardRef(({ onUploadComplete, bucketName = 'card_images', pathPrefix = '', resetKey = 0, targetHeight = 1200, targetWidth = 900 }, ref) => {
  // filesWithIds stores { id, file (WebP), previewUrl, originalFile, originalUrl }
  const [filesWithIds, setFilesWithIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [manualThumbnail, setManualThumbnail] = useState(null); // For manually generated thumbnail { file, previewUrl, sourceImageId }

  const [currentCroppingFile, setCurrentCroppingFile] = useState(null);
  const cropperRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(0.1);
  const [maxZoom, setMaxZoom] = useState(3);
  const aspect = 3 / 4;

  // Reset the component when resetKey changes
  useEffect(() => {
    if (resetKey > 0) {
      resetUploader();
    }
  }, [resetKey]);

  // Reset method to clear all files and thumbnails
  const resetUploader = () => {
    // Clean up URLs before resetting
    filesWithIds.forEach(item => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
    });
    
    if (manualThumbnail?.previewUrl) {
      URL.revokeObjectURL(manualThumbnail.previewUrl);
    }
    
    // Reset states
    setFilesWithIds([]);
    setManualThumbnail(null);
    setError(null);
    
    // Notify parent that files have been reset
    if (onUploadComplete) {
      onUploadComplete({ mainImageFiles: [], thumbnailImageFile: null });
    }
  };

  // Expose the reset method through the ref
  React.useImperativeHandle(ref, () => ({
    reset: resetUploader
  }));

  useEffect(() => {
    // Store the state at the time the effect is set up.
    // The cleanup function will close over these specific arrays/objects.
    const currentFilesWithIds = filesWithIds;
    const currentManualThumbnail = manualThumbnail;

    return () => { // Cleanup function will run only on component unmount
      console.log('ImageUpload unmounting, cleaning up ALL URLs...');
      currentFilesWithIds.forEach(item => {
        if (item.previewUrl) { // Check if previewUrl exists before revoking
          console.log(`Unmount: Revoking URL for main image's preview: ${item.previewUrl}`);
          URL.revokeObjectURL(item.previewUrl);
        }
        if (item.originalUrl) { // Check if originalUrl exists before revoking
          console.log(`Unmount: Revoking URL for original image: ${item.originalUrl}`);
          URL.revokeObjectURL(item.originalUrl);
        }
      });
      if (currentManualThumbnail && currentManualThumbnail.previewUrl) {
        console.log(`Unmount: Revoking URL for manual thumbnail: ${currentManualThumbnail.previewUrl}`);
        URL.revokeObjectURL(currentManualThumbnail.previewUrl);
      }
    };
  }, []); // Empty dependency array ensures this runs only on unmount

  const callOnUploadComplete = () => {
    if (onUploadComplete) {
      const mainImageFiles = filesWithIds.map(f => f.file);
      const thumbnailImageFile = manualThumbnail ? manualThumbnail.file : null;
      onUploadComplete({ mainImageFiles, thumbnailImageFile });
    }
  };

  // Add method to handle thumbnail deletion
  const handleDeleteThumbnail = () => {
    if (manualThumbnail && manualThumbnail.previewUrl) {
      URL.revokeObjectURL(manualThumbnail.previewUrl);
    }
    setManualThumbnail(null);
    callOnUploadComplete(); // Update parent component
  };

  const handleFileChange = async (event) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        console.log('No files selected');
        return;
      }
      
      setIsProcessing(true);
      setError(null);
      
      const newFiles = [...event.target.files];
      console.log(`Processing ${newFiles.length} files`);
      
      // Process each selected file
      const processedFiles = [];
      
      for (const originalFile of newFiles) {
        console.log(`Processing file: ${originalFile.name}`);
        
        try {
          // Convert to WebP format
          const webpFile = await convertToWebP(originalFile, targetWidth, targetHeight);
          
          const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
          const originalUrl = URL.createObjectURL(originalFile);
          const previewUrl = URL.createObjectURL(webpFile);
          
          processedFiles.push({ 
            id,
            file: webpFile,
            previewUrl,
            originalFile,
            originalUrl
          });
          
          console.log(`File processed successfully: ${webpFile.name}`);
        } catch (fileError) {
          console.error(`Error processing file ${originalFile.name}:`, fileError);
          setError(`Error processing ${originalFile.name}: ${fileError.message}`);
        }
      }
      
      // Add new files to state
      setFilesWithIds(prevFiles => [...prevFiles, ...processedFiles]);
      
    } catch (err) {
      console.error('Error handling files:', err);
      setError(`Error handling files: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setError(null);
    const removedFileItem = filesWithIds[indexToRemove]; // Get item before removing
    const updatedFiles = filesWithIds.filter((_, index) => index !== indexToRemove);
    setFilesWithIds(updatedFiles);

    // If the removed image was the source of the manual thumbnail, clear the thumbnail
    if (manualThumbnail && manualThumbnail.sourceImageId === removedFileItem.id) {
      if (manualThumbnail.previewUrl) URL.revokeObjectURL(manualThumbnail.previewUrl);
      setManualThumbnail(null);
    }

    // Revoke URLs for the removed image
    URL.revokeObjectURL(removedFileItem.previewUrl);
    if (removedFileItem.originalUrl) {
      URL.revokeObjectURL(removedFileItem.originalUrl);
    }
    
    callOnUploadComplete(); // MODIFIED to use helper
  };

  const handleEditImage = (index) => {
    const fileToCrop = filesWithIds[index];
    console.log('handleEditImage: Setting up cropper for file', fileToCrop.id);
    setCurrentCroppingFile({ 
      fileWithId: fileToCrop, 
      index, 
      imageSrcForCropper: fileToCrop.originalUrl || fileToCrop.previewUrl
    });
    setZoom(1); // Reset zoom state
  };

  const handleCropModalClose = () => {
    setCurrentCroppingFile(null);
  };

  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
    if (cropperRef.current) {
      cropperRef.current.zoomImage(newValue);
    }
  };

  const handleApplyCrop = async () => {
    if (!cropperRef.current) return;
    if (!currentCroppingFile) {
      setError('No image to crop');
      return;
    }

    try {
      setIsProcessing(true);

      // Get canvas from cropper
      const canvas = cropperRef.current.getCanvas();
      if (!canvas) throw new Error('Failed to generate cropped image');
      
      // Generate a file name
      const fileName = `cropped-${Date.now()}.png`;
      
      // Convert canvas to File
      const croppedFile = await getCroppedImg(canvas, {}, fileName);
      
      // Convert to WebP
      const webPCroppedFile = await convertToWebP(croppedFile, targetWidth, targetHeight);
      
      // Update the correct file in filesWithIds
      let updatedFiles = filesWithIds.map((item, index) => {
        if (index === currentCroppingFile.index) {
          // Revoke old preview URL
          if (item.previewUrl) {
            URL.revokeObjectURL(item.previewUrl);
          }
          
          const newPreviewUrl = URL.createObjectURL(webPCroppedFile);
          return {
            ...item,
            file: webPCroppedFile,
            previewUrl: newPreviewUrl,
          };
        }
        return item;
      });
      setFilesWithIds(updatedFiles);

      // Don't automatically set the cropped image as the thumbnail
      callOnUploadComplete(); 
    } catch (e) {
      console.error('Error applying crop:', e);
      setError(`Failed to apply crop: ${e.message}`);
    } finally {
      setIsProcessing(false);
      handleCropModalClose();
    }
  };

  // Drag and Drop Logic (using simplified state, no external library for now)
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) return;

    const newFilesWithIds = [...filesWithIds];
    const draggedItemContent = newFilesWithIds.splice(dragItem.current, 1)[0];
    newFilesWithIds.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setFilesWithIds(newFilesWithIds);
    // Call onUploadComplete after sorting
    callOnUploadComplete(); // MODIFIED to use helper
  };

  // Call onUploadComplete when manualThumbnail changes
  useEffect(() => {
    callOnUploadComplete();
  }, [manualThumbnail, filesWithIds]); // Added filesWithIds as callOnUploadComplete depends on it

  // Function to handle manual thumbnail generation
  const handleMakeThumbnail = async (sourceImageIndex) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Get the source image file
      const sourceItem = filesWithIds[sourceImageIndex];
      if (!sourceItem) {
        throw new Error('Source image not found');
      }
      
      // We'll use the file directly from filesWithIds which already has the proper format
      // This will work whether the image is original or was previously cropped
      const sourceFile = sourceItem.file;
      
      // If existing thumbnail, clean up its URL
      if (manualThumbnail?.previewUrl) {
        URL.revokeObjectURL(manualThumbnail.previewUrl);
      }
      
      // Generate a new preview URL for the thumbnail
      const thumbnailPreviewUrl = URL.createObjectURL(sourceFile);
      
      // Set the selected image as the thumbnail
      setManualThumbnail({
        file: sourceFile,
        previewUrl: thumbnailPreviewUrl,
        sourceImageId: sourceItem.id
      });
      
      console.log('Thumbnail set successfully from existing image');
      
    } catch (err) {
      console.error('Error creating thumbnail:', err);
      setError(`Failed to create thumbnail: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const onCropperReady = (cropper) => {
    console.log('Cropper ready:', cropper);
    // Use the `cropper` instance passed from the callback for initial setup.
    if (cropper) {
      console.log('Using cropper instance from callback');
      try {
        cropper.zoomImage(zoom);
      } catch (e) {
        console.error('Error applying zoom to cropper instance:', e);
      }
    } else if (cropperRef.current) {
      console.log('Using cropperRef.current');
      try {
        cropperRef.current.zoomImage(zoom);
      } catch (e) {
        console.error('Error applying zoom to cropperRef.current:', e);
      }
    } else {
      console.warn('No cropper instance available for setting zoom');
    }
  };
  
  const onCropperChange = (cropper) => {
    // We don't need to set state on every change like with react-image-crop's onComplete
    // We'll get the final canvas/coordinates when "Apply Crop" is clicked.
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Image Uploader (Drag & Drop, Crop, WebP)
      </Typography>
      
      <label htmlFor="image-upload-input">
        <Input
          accept="image/*"
          id="image-upload-input"
          multiple
          type="file"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
        <Button
          variant="contained"
          component="span"
          disabled={isProcessing}
          startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isProcessing ? 'Processing Files' : 'Select Images'}
        </Button>
      </label>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {filesWithIds.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Previews:</Typography>
          <Grid container spacing={2}>
            {filesWithIds.map((fileWithIdItem, idx) => (
              <Grid item xs={6} sm={4} md={3} key={fileWithIdItem.id}>
                <Box sx={{ position: 'relative' }}>
                  <PreviewImage src={fileWithIdItem.previewUrl} alt={`Preview ${idx + 1}`} />
                  <Box sx={{ position: 'absolute', top: 5, right: 5, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditImage(idx);
                      }}
                      disabled={isProcessing}
                      sx={{ minWidth: 'auto', p: '2px 5px', fontSize: '0.7rem', mb: 0.5 }}
                      title="Crop image"
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMakeThumbnail(idx);
                      }}
                      disabled={isProcessing}
                      sx={{ minWidth: 'auto', p: '2px 5px', fontSize: '0.7rem', mb: 0.5 }}
                    >
                      Make Thumb
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Remove button clicked, index:', idx);
                        handleRemoveImage(idx);
                      }}
                      disabled={isProcessing}
                      sx={{ minWidth: 'auto', p: '2px 5px', fontSize: '0.7rem' }}
                    >
                      X
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {currentCroppingFile && (
        <Modal
          open={!!currentCroppingFile}
          onClose={handleCropModalClose}
          aria-labelledby="crop-image-modal-title"
        >
          <Box sx={modalStyle}>
            <Typography id="crop-image-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
              Edit Image
            </Typography>

            {currentCroppingFile?.imageSrcForCropper && (
              <Box sx={{ height: 400, width: '100%', position: 'relative', mb: 2 }}>
                <Cropper
                  ref={cropperRef}
                  src={currentCroppingFile.imageSrcForCropper}
                  stencilComponent={RectangleStencil}
                  stencilProps={{
                    aspectRatio: aspect,
                  }}
                  onReady={onCropperReady}
                  onChange={onCropperChange}
                  className="advanced-cropper"
                />
              </Box>
            )}
            {!currentCroppingFile?.imageSrcForCropper && currentCroppingFile && (
               <Typography sx={{my:2, color: 'error.main'}}>Error: Original image source for cropper is missing.</Typography>
            )}
            <Box sx={{ width: '80%', my: 2 }}>
                <Typography gutterBottom>Zoom</Typography>
                <Slider
                    value={zoom}
                    min={minZoom}
                    max={maxZoom}
                    step={0.01}
                    aria-labelledby="zoom-slider"
                    valueLabelDisplay="auto"
                    onChange={handleZoomChange}
                    disabled={isProcessing || !currentCroppingFile}
                />
            </Box>
            {isProcessing && <CircularProgress sx={{my: 2}}/>}
            <Box sx={{ mt: 3, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCropModalClose} sx={{ mr: 1 }} disabled={isProcessing}>
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleApplyCrop} 
                disabled={isProcessing || !currentCroppingFile}
                title="Apply crop to the image"
              >
                {isProcessing ? 'Applying...' : 'Apply Crop'}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      {manualThumbnail && manualThumbnail.previewUrl && (
        <Box sx={{ mt: 3, p: 2, border: '1px dashed grey', display: 'inline-block', position: 'relative' }}>
          <Typography variant="subtitle2" gutterBottom>
            Current Thumbnail (from: {filesWithIds.find(f => f.id === manualThumbnail.sourceImageId)?.file.name || 'N/A'})
          </Typography>
          <ThumbnailPreviewImage src={manualThumbnail.previewUrl} alt="Manual Thumbnail Preview" />
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={handleDeleteThumbnail}
            disabled={isProcessing}
            sx={{ position: 'absolute', top: 10, right: 10, minWidth: 'auto', p: '2px 8px', fontSize: '0.7rem' }}
          >
            Delete
          </Button>
        </Box>
      )}
    </Paper>
  );
});

/* // Temporarily comment out CustomStyles and the HOC export for debugging
const CustomStyles = () => (
  <GlobalStyles
    styles={{
      '.advanced-cropper .advanced-cropper-stencil__preview': {
         borderStyle: 'solid !important',
      },
      '.advanced-cropper': {
        height: '100%',
        width: '100%',
      },
      '.advanced-cropper-stencil__handler': {
        // styling for handlers
      },
      '.advanced-cropper-stencil__line': {
        // background: 'rgba(255,255,255,0.7) !important',
        // borderStyle: 'solid !important'
      }
    }}
  />
);

const ImageUploadWithStyles = (props) => (
  <>
    <CustomStyles />
    <ImageUpload {...props} />
  </>
);

export default ImageUploadWithStyles; 
*/

export default ImageUpload; 