-- Add release_date column to subsets table
ALTER TABLE subsets ADD COLUMN IF NOT EXISTS release_date DATE;

-- Comment on the column
COMMENT ON COLUMN subsets.release_date IS 'The release date of the subset';

-- Create a function to ensure release_date column exists
CREATE OR REPLACE FUNCTION add_release_date_to_subsets()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the column already exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'subsets'
    AND column_name = 'release_date'
  ) THEN
    -- Column already exists
    RETURN true;
  ELSE
    -- Add the column
    ALTER TABLE subsets ADD COLUMN release_date DATE;
    COMMENT ON COLUMN subsets.release_date IS 'The release date of the subset';
    RETURN true;
  END IF;
  
  EXCEPTION WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Grant access to this function
GRANT EXECUTE ON FUNCTION add_release_date_to_subsets() TO service_role;

-- Update the RLS policy if needed to include the new column
