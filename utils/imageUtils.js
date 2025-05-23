/**
 * Utility functions for optimized image handling
 */

/**
 * Generate a simple SVG placeholder as a data URL
 * 
 * @param {number} width - Width of the placeholder
 * @param {number} height - Height of the placeholder
 * @param {string} color - Background color in hex format
 * @returns {string} - Base64 encoded SVG data URL
 */
export const generatePlaceholder = (width = 200, height = 200, color = '#eeeeee') => {
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="${color}"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Get optimal sizes attribute for responsive images
 * 
 * @param {string} type - Type of image (thumbnail, card, hero, etc.)
 * @returns {string} - Sizes attribute for the image
 */
export const getImageSizes = (type) => {
  switch (type) {
    case 'thumbnail':
      return '50px';
    case 'card':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    case 'gallery':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'hero':
      return '100vw';
    default:
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw';
  }
};

/**
 * Get default image props for Next.js Image component
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.type - Type of image (thumbnail, card, etc.)
 * @param {number} options.quality - Image quality (1-100)
 * @param {string} options.loading - Loading behavior ('lazy' or 'eager')
 * @returns {Object} - Props to spread into Next.js Image component
 */
export const getImageProps = (options = {}) => {
  const { 
    type = 'thumbnail',
    quality = 75,
    loading = 'lazy'
  } = options;
  
  // Base props
  const baseProps = {
    quality,
    loading,
    placeholder: 'blur',
    sizes: getImageSizes(type),
  };
  
  // Handle different image types
  switch (type) {
    case 'thumbnail':
      return {
        ...baseProps,
        width: 50,
        height: 70,
        blurDataURL: generatePlaceholder(50, 70),
        style: {
          objectFit: 'contain',
          borderRadius: '4px',
          transition: 'opacity 0.3s ease'
        }
      };
    case 'card':
      return {
        ...baseProps,
        fill: true, // Use fill layout for responsive cards
        blurDataURL: generatePlaceholder(300, 200),
        style: {
          objectFit: 'cover',
          borderRadius: '4px 4px 0 0',
          transition: 'transform 0.3s ease, opacity 0.3s ease'
        }
      };
    case 'gallery':
      return {
        ...baseProps,
        width: 400,
        height: 300,
        blurDataURL: generatePlaceholder(400, 300),
        style: {
          objectFit: 'cover',
          borderRadius: '4px',
          transition: 'opacity 0.3s ease'
        }
      };
    default:
      return {
        ...baseProps,
        width: 200,
        height: 200,
        blurDataURL: generatePlaceholder(200, 200),
        style: {
          objectFit: 'contain',
          borderRadius: '4px',
          transition: 'opacity 0.3s ease'
        }
      };
  }
}; 