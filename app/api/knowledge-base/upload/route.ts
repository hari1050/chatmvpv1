import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // Check if the request is multipart form-data
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const fileName = formData.get('fileName') as string;
      const userId = formData.get('userId') as string;
      
      if (!file || !userId) {
        return NextResponse.json(
          { error: 'Missing required parameters' },
          { status: 400 }
        );
      }
      
      // For text files, you can extract content as text
      let content = '';
      if (file.type === 'text/plain') {
        content = await file.text();
      } else {
        // For binary files like PDFs, we'll store the file itself
        // Convert the file to an ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        
        // Upload the file to Supabase Storage
        const { data: storageData, error: storageError } = await supabase
          .storage
          .from('knowledge_base')
          .upload(`${userId}/${Date.now()}_${fileName}`, buffer, {
            contentType: file.type,
            upsert: false
          });
          
        if (storageError) throw storageError;
        
        // Set the content to the storage path
        content = storageData.path;
      }
      
      // Insert into knowledge base
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({
          content,
          file_name: fileName,
          user_id: userId,
          file_type: file.type,
          is_file_reference: file.type !== 'text/plain', // Flag to indicate if content is actual text or a reference to stored file
        })
        .select()
        .single();
  
      if (error) throw error;
  
      return NextResponse.json(data);
    } else {
      // Handle JSON requests (backward compatibility)
      const { content, fileName, userId } = await req.json();
  
      if (!content || !userId) {
        return NextResponse.json(
          { error: 'Missing required parameters' },
          { status: 400 }
        );
      }
  
      // Insert into knowledge base
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({
          content,
          file_name: fileName,
          user_id: userId,
          file_type: 'text/plain',
          is_file_reference: false,
        })
        .select()
        .single();
  
      if (error) throw error;
  
      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error('Error in knowledge base upload:', error);
    return NextResponse.json(
      { error: `Failed to process upload: ${error.message}` },
      { status: 500 }
    );
  }
}