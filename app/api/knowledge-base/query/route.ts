import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import * as rtfParser from 'rtf-parser';
import { promisify } from 'util';

// Promisify rtfParser.string function
const parseRtf = promisify(rtfParser.string);

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { query, user_id } = await req.json();
    console.log("Query:", query, "User ID:", user_id);

    if (!query || !user_id) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Fetch relevant knowledge base entries with more details
    const { data: entries, error } = await supabase
      .from('knowledge_base')
      .select('content, file_name, file_type, is_file_reference')
      .eq('user_id', user_id)
      .limit(5);
    if (error) throw error;

    if (!entries || entries.length === 0) {
      return NextResponse.json({
        answer: "I don't have enough information to answer that question. Would you like to speak with an agent?",
        noInformation: true
      });
    }

    console.log(`Found ${entries.length} knowledge base entries`);

    // Process each entry to get actual content
    const processedEntries = await Promise.all(
      entries.map(async (entry) => {
        // If it's not a file reference, return content directly
        if (!entry.is_file_reference) {
          console.log(`Processing text entry: ${entry.file_name}`);
          return {
            source: entry.file_name,
            content: entry.content
          };
        }
        
        // If it's a file reference, fetch the file from storage
        try {
          console.log(`Fetching file from storage: ${entry.content}`);
          const { data, error: downloadError } = await supabase
            .storage
            .from('knowledge_base')
            .download(entry.content);
            
          if (downloadError) throw downloadError;
          
          // Convert file to text based on type
          let textContent = '';
          
          if (entry.file_type === 'text/plain') {
            // Plain text file
            textContent = await data.text();
          } else if (entry.file_type === 'application/msword' || 
                     entry.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // Word document (.doc or .docx)
            try {
              const { value } = await mammoth.extractRawText({
                arrayBuffer: await data.arrayBuffer()
              });
              textContent = value;
            } catch (docError) {
              console.error(`Error parsing Word document ${entry.file_name}:`, docError);
              textContent = `[Unable to parse Word document content from ${entry.file_name}]`;
            }
          } else if (entry.file_type === 'text/rtf' || 
                     entry.file_type === 'application/rtf' || 
                     entry.file_type === 'application/x-rtf' ||
                     entry.file_type === 'text/richtext') {
            // RTF document
            try {
              const rtfText = await data.text();
              const doc = await parseRtf(rtfText);
              textContent = extractTextFromRtfDoc(doc);
            } catch (rtfError) {
              console.error(`Error parsing RTF document ${entry.file_name}:`, rtfError);
              textContent = `[Unable to parse RTF content from ${entry.file_name}]`;
            }
          } else {
            textContent = `[Unsupported file type content from ${entry.file_name} (${entry.file_type})]`;
          }
          
          console.log(`Processed file ${entry.file_name}, extracted ${textContent.length} characters`);
          
          return {
            source: entry.file_name,
            content: textContent
          };
        } catch (fileError) {
          console.error(`Error fetching file ${entry.file_name}:`, fileError);
          return {
            source: entry.file_name,
            content: `[Error retrieving content from ${entry.file_name}]`
          };
        }
      })
    );

    // Combine all processed entries into context
    const context = processedEntries
      .map(entry => `Source: ${entry.source}\n${entry.content}`)
      .join('\n\n');

    console.log(`Combined context length: ${context.length} characters`);

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
      Context: ${context}
      
      Question: ${query}
      
      Please provide a concise, professional response based on the context provided. 
      If the context doesn't contain relevant information to answer the question, 
      respond with "NO_INFORMATION". Keep the response under 150 words and focus 
      on being helpful and accurate.
    `;

    console.log("Sending request to Gemini");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("Received response from Gemini");

    if (text === "NO_INFORMATION") {
      return NextResponse.json({
        answer: "I don't have enough information to answer that question. Would you like to speak with an agent?",
        noInformation: true
      });
    }

    return NextResponse.json({
      answer: text,
      noInformation: false
    });

  } catch (error) {
    console.error('Error in knowledge base query:', error);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}

// Helper function to extract text from RTF document
function extractTextFromRtfDoc(doc: any): string {
  let text = '';
  
  // Handle content array
  if (doc.content && Array.isArray(doc.content)) {
    doc.content.forEach((item: any) => {
      if (typeof item.value === 'string') {
        text += item.value;
      }
      
      // Process nested content
      if (item.content && Array.isArray(item.content)) {
        text += extractTextFromRtfDoc(item);
      }
    });
  }
  
  return text;
}