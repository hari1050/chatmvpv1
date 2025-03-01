// app/widget/[chatbotId]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import WidgetClient from './WidgetClient';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export default async function WidgetPage({
  params
}: {
  params: Promise<{ chatbotId: string }>
}) {
  const { chatbotId } = await params;
  
  try {
    // Create Supabase client directly in this file
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', chatbotId)
      .single();

    if (!chatbot) {
      return notFound();
    }

    return <WidgetClient chatbot={chatbot} />;
  } catch (error) {
    console.error('Error loading chatbot:', error);
    return notFound();
  }
}