// app/widget/[chatbotId]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import WidgetClient from './WidgetClient';

export const dynamic = 'force-dynamic';

export default async function WidgetPage({
  params
}: {
  params: Promise<{ chatbotId: string }>
}) {
  const { chatbotId } = await params;
  
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

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