'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Crop as CropIcon,
} from '@mui/icons-material';

export default function DraggableImageItem({
  id,
  url,
  index,
  isThumbnail,
  onSetAsThumbnail,
  onRemoveImage,
  onPreviewImage,
  onCropImage,
  style = {}
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    ...style,
  };

  return (
    <Box
      ref={setNodeRef}
      style={sortableStyle}
      sx={{
        position: 'relative',
        width: 120,
        height: 168,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3,
        border: isThumbnail ? '2px solid #f9a825' : 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        '&:hover .drag-handle': {
          opacity: 1,
        }
      }}
    >
      {/* Drag Handle */}
      <Box
        className="drag-handle"
        {...attributes}
        {...listeners}
        sx={{
          position: 'absolute',
          top: 4,
          left: 4,
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#fff',
          borderRadius: '4px',
          padding: '2px',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          cursor: 'grab',
          zIndex: 2,
          '&:active': {
            cursor: 'grabbing',
          }
        }}
      >
        <DragIcon fontSize="small" />
      </Box>

      <img
        src={url}
        alt={`Image ${index + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          backgroundColor: 'rgba(0,0,0,0.04)',
          cursor: 'pointer'
        }}
        onClick={() => onPreviewImage && onPreviewImage(url)}
        onError={(e) => {
          console.error('Failed to load image:', url);
          e.target.style.backgroundColor = '#f5f5f5';
          e.target.alt = 'Failed to load image';
        }}
      />
      
      {/* Action Overlay */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        p: 0.75,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
      }}>
        <Tooltip title={isThumbnail ? "Current thumbnail" : "Set as thumbnail"}>
          <IconButton 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onSetAsThumbnail && onSetAsThumbnail(url);
            }}
            sx={{
              backgroundColor: isThumbnail ? 'rgba(249, 168, 37, 0.7)' : 'rgba(0,0,0,0.5)',
              color: '#fff',
              '&:hover': {
                backgroundColor: isThumbnail ? 'rgba(249, 168, 37, 0.9)' : 'rgba(0,0,0,0.7)',
              }
            }}
          >
            {isThumbnail ? (
              <StarIcon fontSize="small" />
            ) : (
              <StarBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {onCropImage && (
            <Tooltip title="Crop image">
              <IconButton 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onCropImage(url, index);
                }}
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                }}
              >
                <CropIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Remove image">
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveImage && onRemoveImage(url);
              }}
              sx={{
                backgroundColor: 'rgba(220,0,0,0.5)',
                color: '#fff',
                '&:hover': { backgroundColor: 'rgba(220,0,0,0.7)' }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {isThumbnail && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: '#f9a825',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 600,
          }}
        >
          Thumbnail
        </Box>
      )}
    </Box>
  );
} 