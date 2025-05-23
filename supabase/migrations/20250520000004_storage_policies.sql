-- Storage policies for card images and slab images
-- These policies control who can upload, view, update, and delete images

-- Card Images bucket policies
CREATE POLICY "Allow authenticated users to upload to cardimages"
ON storage.objects
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cardimages');

CREATE POLICY "Allow authenticated users to view cardimages"
ON storage.objects
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (bucket_id = 'cardimages');

CREATE POLICY "Public Access to cardimages"
ON storage.objects
AS PERMISSIVE
FOR SELECT
TO public
USING (bucket_id = 'cardimages');

CREATE POLICY "Allow authenticated users to update cardimages"
ON storage.objects
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (bucket_id = 'cardimages');

CREATE POLICY "Allow authenticated users to delete from cardimages"
ON storage.objects
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (bucket_id = 'cardimages');

-- Slab Images bucket policies
CREATE POLICY "Allow authenticated users to upload to slabimages"
ON storage.objects
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'slabimages');

CREATE POLICY "Allow authenticated users to view slabimages"
ON storage.objects
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (bucket_id = 'slabimages');

CREATE POLICY "Public Access to slabimages"
ON storage.objects
AS PERMISSIVE
FOR SELECT
TO public
USING (bucket_id = 'slabimages');

CREATE POLICY "Allow authenticated users to update slabimages"
ON storage.objects
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (bucket_id = 'slabimages');

CREATE POLICY "Allow authenticated users to delete from slabimages"
ON storage.objects
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (bucket_id = 'slabimages'); 