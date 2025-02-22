-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to read their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read all logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own logos" ON storage.objects;

-- Create or update the logos bucket with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('logos', 'logos', true, 5242880)
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create unified policies that enforce proper user isolation
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