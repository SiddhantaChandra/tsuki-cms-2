
# Task List: Image Upload Enhancement Implementation

## 📋 Overview
Implement freeform cropping, remove fixed image sizes, and add drag-and-drop reordering for image arrays.

## 🔧 Prerequisites & Dependencies

### Task 1: Install Required Dependencies
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```
**Files affected:** `package.json`

---

## 🖼️ Phase 1: Freeform Crop Implementation

### Task 2: Update ImageUpload Component Cropper Configuration
**File:** `components/ImageUpload/ImageUpload.js`
- [ ] Remove fixed `aspect = 3 / 4` ratio constraint
- [ ] Update `Cropper` component props to allow freeform cropping:
  ```js
  // Remove aspectRatio prop or set to null
  stencilProps={{
    aspectRatio: null, // Allow any aspect ratio
    movable: true,
    resizable: true
  }}
  ```
- [ ] Update `RectangleStencil` to be fully flexible
- [ ] Test cropper behavior with various image sizes

### Task 3: Update Cropper Modal Styling
**File:** `components/ImageUpload/ImageUpload.js`
- [ ] Adjust modal dimensions to accommodate various crop shapes
- [ ] Update cropper container height to be more flexible
- [ ] Ensure cropper controls work with freeform shapes

### Task 4: Update Slabs EditSlabForm Cropper
**File:** `components/Slabs/EditSlabForm.js`
- [ ] Remove fixed aspect ratio from slabs cropper
- [ ] Update stencil configuration for freeform crops
- [ ] Ensure consistency with main ImageUpload component

---

## 📏 Phase 2: Remove Fixed Image Sizes

### Task 5: Update ImageUpload Component Props
**File:** `components/ImageUpload/ImageUpload.js`
- [ ] Remove `targetHeight = 1200` and `targetWidth = 900` default props
- [ ] Make size parameters optional or remove entirely
- [ ] Update component prop types and documentation

### Task 6: Update Image Compression Settings
**File:** `components/ImageUpload/ImageUpload.js`
- [ ] Modify `imageCompression` options to not enforce specific dimensions:
  ```js
  const options = {
    maxSizeMB: 1,
    useWebWorker: true,
    // Remove maxWidthOrHeight constraint
  };
  ```
- [ ] Keep quality settings but remove size restrictions

### Task 7: Update Component Usage Across Forms
**Files:** 
- `components/Cards/NewCardForm.js`
- `components/Cards/EditCardForm.js`
- `components/Slabs/NewSlabForm.js`
- `components/Slabs/EditSlabForm.js`

- [ ] Remove `targetHeight` and `targetWidth` props from ImageUpload usage
- [ ] Update any size-related validation logic
- [ ] Test image upload in all forms

---

## 🎯 Phase 3: DND Kit Implementation

### Task 8: Create Draggable Image Item Component
**New File:** `components/ImageUpload/DraggableImageItem.js`
- [ ] Create reusable draggable image component
- [ ] Include drag handle visual indicator
- [ ] Handle drag state styling (opacity, scale, etc.)
- [ ] Include existing image actions (thumbnail, delete, crop)

### Task 9: Update EditCardForm with DND
**File:** `components/Cards/EditCardForm.js`
- [ ] Import DND kit components:
  ```js
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
  ```
- [ ] Wrap existing image grid with DND context
- [ ] Implement `handleDragEnd` function to reorder arrays
- [ ] Update state management for reordered images
- [ ] Add visual feedback during drag operations

### Task 10: Update Image Reordering Logic
**File:** `components/Cards/EditCardForm.js`
- [ ] Create function to handle drag end events:
  ```js
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setExistingImageUrls((items) => {
        const oldIndex = items.findIndex(item => item === active.id);
        const newIndex = items.findIndex(item => item === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  ```
- [ ] Update thumbnail logic when images are reordered
- [ ] Ensure database updates reflect new order

### Task 11: Add DND to New Card Form
**File:** `components/Cards/NewCardForm.js`
- [ ] Implement similar DND logic for new card image uploads
- [ ] Handle reordering of uploaded but not yet saved images
- [ ] Ensure thumbnail selection works with reordered images

### Task 12: Update Slabs Forms with DND
**Files:**
- `components/Slabs/EditSlabForm.js`
- `components/Slabs/NewSlabForm.js`
- [ ] Implement DND for slabs image management
- [ ] Ensure consistency with cards implementation
- [ ] Test reordering functionality

---

## 🎨 Phase 4: UI/UX Enhancements

### Task 13: Add Drag Visual Indicators
**Files:** Multiple form components
- [ ] Add drag handle icons (⋮⋮ or ≡ symbols)
- [ ] Implement hover states for draggable items
- [ ] Add cursor changes on drag-enabled areas
- [ ] Show drop zones during drag operations

### Task 14: Update Styling for New Layout
**Files:** Form components
- [ ] Ensure consistent spacing with variable aspect ratios
- [ ] Update image container styling for flexibility
- [ ] Add smooth transitions for drag operations
- [ ] Implement loading states during reorder operations

### Task 15: Add Accessibility Features
**Files:** DND components
- [ ] Add ARIA labels for drag operations
- [ ] Implement keyboard navigation for reordering
- [ ] Add screen reader announcements for reorder actions
- [ ] Ensure focus management during drag operations

---



---

## 📚 Phase 6: Documentation & Cleanup

### Task 19: Update Component Documentation
- [ ] Document new DND props and usage
- [ ] Update ImageUpload component prop documentation
- [ ] Create examples for freeform cropping
- [ ] Document reordering behavior

### Task 20: Code Cleanup
- [ ] Remove unused size-related code
- [ ] Clean up any hardcoded aspect ratio references
- [ ] Optimize performance for drag operations
- [ ] Remove any debug code or console logs

---

## 📋 Success Criteria

✅ **Freeform Cropping:** Users can crop images to any aspect ratio without constraints  
✅ **Flexible Sizing:** Images can be uploaded without fixed size requirements  
✅ **Drag & Drop:** Users can reorder images by dragging them within the interface  
✅ **Consistency:** All forms (Cards/Slabs, New/Edit) have consistent behavior  
✅ **Performance:** No degradation in upload or display performance  
✅ **Accessibility:** Full keyboard and screen reader support for all new features