export * from './database';

export interface ChatbotSettings {
  name: string;
  chatbotName: string;
  userName: string;
  primaryColor: string;
  chatBackgroundColor: string;
  fontFamily: string;
  aiTone: 'professional' | 'friendly' | 'casual';
  predefinedQuestions: string[];
  logo?: string;
}

export interface Chatbot {
  id: string;
  name: string;
  user_id: string;
  settings: ChatbotSettings;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: Date;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  chatbot_id: string | null;
  visitor_session_id: string;
  created_at: string;
}

export interface FlowStep {
  content: string;
  options?: string[];
  nextStep: string | {
    [key: string]: string;
    default: string;
  };
}

export interface Flow {
  name: string;
  initialStep: string;
  steps: Record<string, FlowStep>;
} 