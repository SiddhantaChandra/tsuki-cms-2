# TsukiCMS MVP Tasks

## Login Flow (Admin Only)
### Overview
- No public sign-up functionality
- Only emails listed in admin_list table can access the system
- Uses Supabase Auth with email/password authentication

### Implementation Details
- [x] Create login page with:
  - [x] Email input field
  - [x] Password input field
  - [x] Error handling for invalid credentials
- [x] Implement admin verification:
  - [x] Check if email exists in admin_list table
  - [x] Create middleware to verify admin status on protected routes
- [x] Implement session management:
  - [x] Store Supabase session in secure cookie
  - [x] Add session refresh mechanism
  - [x] Handle session expiration
- [x] Create logout functionality:
  - [x] Clear session
  - [x] Redirect to login page

### Security Measures
- [ ] Implement rate limiting for login attempts
- [ ] Add request logging for security monitoring
- [ ] Set up proper CORS configuration
- [ ] Configure secure session cookies

## 1. Project Setup and Authentication
- [x] Initialize Next.js project with App Router
- [x] Set up MUI (Material UI) with basic theme configuration
- [x] Configure Supabase client
- [x] Implement authentication UI using Supabase Auth
- [x] Create admin verification middleware using admin_list table

## 2. Core Layout and Navigation
- [x] Create responsive layout with MUI
- [x] Implement navigation sidebar/header
- [x] Add dark mode toggle
- [x] Create protected routes for admin areas

## 3. Category Management
- [x] Create category listing page
- [x] Implement category creation form
- [x] Add category edit functionality
- [x] Enable category deletion with confirmation
- [x] Add validation and error handling

## 4. Sets and Subsets
- [x] Create sets listing page with category filter
- [x] Implement set creation form with category selection
- [x] Create subset management within sets
- [x] Add edit/delete functionality for sets and subsets
- [x] Implement breadcrumb navigation

## 5. Card Management (Core Feature)
- [x] Create card listing page with filters (category/set/subset)
- [x] Implement card creation form with:
  - [x] Image upload to Supabase Storage (Note: image_urls to become an array of strings)
  - [x] Automatic thumbnail generation (Note: To be user-triggered from 0th image, size 240x320)
  - [x] Category/Set/Subset selection
  - [x] Price, condition, and language fields
- [x] Add card edit functionality
- [x] Enable card deletion with confirmation
- [x] Implement card search and filtering

## 6. Slab Management
- [x] Create slab listing page with grade filters
- [x] Implement slab creation form with:
  - [x] Image upload and thumbnail generation
  - [x] Grading company and score fields
  - [x] Category/Set/Subset selection
- [x] Add slab edit functionality
- [x] Enable slab deletion with confirmation

## 7. Accessories Management
- [x] Create accessories listing page
- [x] Implement accessory creation form with:
  - [x] Image upload
  - [x] Accessory type selection
  - [x] Price and details
- [x] Add accessory edit functionality
- [x] Enable accessory deletion with confirmation
- [x] Add database schema updates for accessories:
  - [x] Add category_id column to accessories table for proper categorization
  - [x] Add description column for detailed product information
  - [x] Add stock_quantity column for inventory management

## 8. Image Management and Optimization
- [x] Help set up Supabase to accept images (permissions, policies for image buckets)
- [x] Implement image upload with preview (Initial implementation in card form done, to be enhanced by component below)
- [x] Create image optimization pipeline (Client-side WebP conversion)
- [x] Add image deletion cleanup (When cards/items are deleted, or images are removed from an item)

### Independent Image Upload Component & Processing
- [x] Develop an independent image upload component with:
  - [x] Image cropper integration (crop, zoom adjustment).
  - [x] Image processing to ensure 3:4 aspect ratio (e.g., 900x1200).
  - [x] Image conversion to WebP format before/during upload.
  - [x] Functionality to upload multiple images.
  - [x] Display of image previews in order of upload.
  - [x] Storage of multiple image URLs as an array, in order of upload.
  - [x] Button/action to set any image as the thumbnail.
  - [ ] Drag-and-drop reordering of images in the preview field (and update URL array order).

## 9. Data Display and UX
- [x] Implement table pagination
- [x] Add sorting functionality
- [x] Create filter sidebar/panel
- [x] Add loading states and animations
- [x] Implement error boundaries and fallbacks

## 10. Final Polish
- [x] Add form validation across all forms
- [x] Implement success/error notifications
- [x] Add confirmation dialogs for destructive actions
- [x] Create loading skeletons
- [x] Test and fix responsive design issues

## 11. Database Schema Improvements
- [x] Add category_id to accessories table
- [x] Add description to accessories table
- [x] Add stock_quantity to accessories table
- [x] Create views for accessories filtered by category (pokemon_accessories, onepiece_accessories)
- [x] Update collection_stats view to include accessories

## 12. Dashboard and UI Enhancements
- [x] Create modern dashboard with greeting banner and statistics cards
- [x] Implement beautiful gradient designs with animations
- [x] Add responsive statistics cards showing real-time data
- [x] Create recently added items table
- [x] Implement clean cards management page with header and action buttons
- [x] Add consistent styling across all pages (sets, categories, subsets)

## Notes
- Each task should include proper error handling ✅
- All forms should have proper validation ✅
- Implement proper loading states ✅
- Follow MUI best practices for consistent UI ✅
- Ensure all database operations are properly secured with RLS policies ✅
