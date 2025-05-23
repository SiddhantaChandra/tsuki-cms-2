-- Create a function to add the release_date column if it doesn't exist
CREATE OR REPLACE FUNCTION public.add_release_date_to_subsets()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the column exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'subsets'
    AND column_name = 'release_date'
  ) THEN
    -- Add the release_date column if it doesn't exist
    ALTER TABLE public.subsets ADD COLUMN release_date DATE;
    
    -- Add a comment to the column
    COMMENT ON COLUMN public.subsets.release_date IS 'The release date of the subset';
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.add_release_date_to_subsets() TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_release_date_to_subsets() TO service_role;

-- You can run this function directly now to add the column
SELECT add_release_date_to_subsets(); 