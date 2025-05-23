-- Update the cards table to ensure condition is INTEGER type

-- First, check if we need to convert the column type
DO $$ 
DECLARE
    column_type text;
BEGIN
    -- Get the current data type of the condition column
    SELECT data_type INTO column_type 
    FROM information_schema.columns 
    WHERE table_name = 'cards' AND column_name = 'condition';
    
    -- Only proceed with conversion if the column is text type
    IF column_type = 'text' THEN
        -- First, remove the NOT NULL constraint to allow type conversion
        EXECUTE 'ALTER TABLE "public"."cards" ALTER COLUMN "condition" DROP NOT NULL';
        
        -- Convert the existing text values to integers 
        EXECUTE 'UPDATE "public"."cards" SET "condition" = 
          CASE 
            WHEN "condition" ILIKE ''%gem%mint%10%'' OR "condition" = ''10'' THEN ''10''
            WHEN "condition" ILIKE ''%mint%9%'' OR "condition" = ''9'' THEN ''9''
            WHEN "condition" ILIKE ''%nm%8%'' OR "condition" = ''8'' OR "condition" ILIKE ''%near%mint%'' THEN ''8''
            WHEN "condition" ILIKE ''%light%play%7%'' OR "condition" = ''7'' OR "condition" ILIKE ''%lightly%played%'' THEN ''7''
            WHEN "condition" ILIKE ''%heavy%play%6%'' OR "condition" = ''6'' OR "condition" ILIKE ''%heavily%played%'' THEN ''6''
            ELSE ''8'' -- Default to NM if can''t determine
          END';
        
        -- Change the column type to integer, casting the values
        EXECUTE 'ALTER TABLE "public"."cards" ALTER COLUMN "condition" TYPE INTEGER USING ("condition"::INTEGER)';
        
        -- Add back the NOT NULL constraint
        EXECUTE 'ALTER TABLE "public"."cards" ALTER COLUMN "condition" SET NOT NULL';
        
        RAISE NOTICE 'Successfully converted condition column from TEXT to INTEGER';
    ELSE
        RAISE NOTICE 'Column condition already has type: %', column_type;
    END IF;
END $$;

-- Update the schema definition for future deployments
COMMENT ON COLUMN "public"."cards"."condition" IS 'Numeric condition rating (10: Gem Mint, 9: Mint, 8: NM, 7: Lightly Played, 6: Heavily Played)'; 