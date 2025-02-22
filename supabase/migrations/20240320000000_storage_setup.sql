-- Create the logos bucket if it doesn't exist
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, owner)
    VALUES ('logos', 'logos', true, 5242880, NULL)  -- 5MB limit
    ON CONFLICT (id) DO UPDATE
    SET public = true,
        file_size_limit = 5242880;
EXCEPTION
    WHEN undefined_table THEN
        -- If storage.buckets doesn't exist, create it first
        CREATE TABLE IF NOT EXISTS storage.buckets (
            id text PRIMARY KEY,
            name text NOT NULL,
            owner uuid REFERENCES auth.users,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now(),
            public boolean DEFAULT false,
            avif_autodetection boolean DEFAULT false,
            file_size_limit bigint DEFAULT null,
            allowed_mime_types text[] DEFAULT null
        );
        
        -- Then insert the bucket
        INSERT INTO storage.buckets (id, name, public, file_size_limit, owner)
        VALUES ('logos', 'logos', true, 5242880, NULL);
END $$;

-- Create objects table if it doesn't exist
CREATE TABLE IF NOT EXISTS storage.objects (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    bucket_id text REFERENCES storage.buckets(id),
    name text,
    owner uuid REFERENCES auth.users,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_accessed_at timestamptz DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED
);

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read all logos" ON storage.objects;

-- Create storage policies
CREATE POLICY "Users can upload their own logos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own logos" ON storage.objects
FOR UPDATE TO authenticated
USING (
    bucket_id = 'logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read their own logos" ON storage.objects
FOR SELECT TO authenticated
USING (
    bucket_id = 'logos' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR auth.role() = 'authenticated')
);

CREATE POLICY "Users can delete their own logos" ON storage.objects
FOR DELETE TO authenticated
USING (
    bucket_id = 'logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to all logos since the bucket is public
CREATE POLICY "Allow public to read all logos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'logos');

-- Create storage functions if they don't exist
CREATE OR REPLACE FUNCTION storage.foldername(name text)
RETURNS text[]
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN string_to_array(name, '/');
END
$$; 