import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, imageUrl, isThumbnail, onDelete, onSetThumbnail, style: customStyle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    ...customStyle,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="sortable-item"
    >
      <div style={{
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '2px solid var(--border-color)',
        backgroundColor: 'var(--section-bg)',
        cursor: 'grab',
        width: '100%',
      }}>
        
        <img
          src={imageUrl}
          alt="Card"
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
          bottom: '8px',
          right: '8px',
          display: 'flex',
          gap: '8px',
        }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(imageUrl);
            }}
            style={{
              padding: '6px 10px',
              backgroundColor: 'var(--error-color)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
            title="Delete image"
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortableItem; 