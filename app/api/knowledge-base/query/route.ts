import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

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
    console.log(query, user_id)

    if (!query || !user_id) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Fetch relevant knowledge base entries
    const { data: entries, error } = await supabase
      .from('knowledge_base')
      .select('content')
      .eq('user_id', user_id)
      .limit(5);
    if (error) throw error;

    if (!entries || entries.length === 0) {
      return NextResponse.json({
        answer: "I don't have enough information to answer that question. Would you like to speak with an agent?",
        noInformation: true
      });
    }

    // Combine all knowledge base entries into context
    const context = entries.map(entry => entry.content).join('\n\n');

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Context: ${context}
      
      Question: ${query}
      
      Please provide a concise, professional response based on the context provided. 
      If the context doesn't contain relevant information to answer the question, 
      respond with "NO_INFORMATION". Keep the response under 150 words and focus 
      on being helpful and accurate.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

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