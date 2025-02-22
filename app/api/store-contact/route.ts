import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { 
      flow, 
      location, 
      propertyType, 
      budget, 
      email, 
      phone, 
      name, 
      contactTime, 
      userId 
    } = await req.json();

    if (!email || !phone) {
      return NextResponse.json(
        { error: 'Missing required contact details' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('contact_inquiries')
      .insert({
        flow,
        location,
        property_type: propertyType,
        budget,
        email,
        phone,
        name,
        contact_time: contactTime,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error storing contact details:', error);
    return NextResponse.json(
      { error: 'Failed to store contact details' },
      { status: 500 }
    );
  }
}