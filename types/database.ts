export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface User {
  id: string;
  email: string | null;
  agent_name: string | null;
  agent_description: string | null;
  website_url: string | null;
  photo_url: string | null;
  brand_colors: {
    primary: string;
  };
  setup_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebsiteConfig {
  id: string;
  user_id: string;
  url: string;
  colors: string[];
  last_scraped: string;
  created_at: string;
  updated_at: string;
}

export interface WebsiteContent {
  id: string;
  user_id: string;
  url: string;
  content: Array<{
    type: string;
    text: string;
    url: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface WebsiteEmbedding {
  id: string;
  user_id: string;
  url: string;
  content_chunk: string;
  embedding: number[] | null;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  visitor_session_id: string;
  lead_captured: boolean;
  lead_email: string | null;
  lead_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      chatbots: {
        Row: {
          id: string
          user_id: string
          name: string
          settings: Json
          flows: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          settings: Json
          flows?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          settings?: Json
          flows?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbots_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      faqs: {
        Row: {
          id: string
          user_id: string
          question: string
          answer: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question: string
          answer: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question?: string
          answer?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faqs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      knowledge_base: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_type: string
          file_path: string
          file_size: number
          processed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_type: string
          file_path: string
          file_size: number
          processed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_type?: string
          file_path?: string
          file_size?: number
          processed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      knowledge_base_chunks: {
        Row: {
          id: string
          content: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          metadata: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          website: string | null
          setup_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          website?: string | null
          setup_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          website?: string | null
          setup_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      website_config: {
        Row: WebsiteConfig;
        Insert: Omit<WebsiteConfig, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<WebsiteConfig, 'id' | 'created_at' | 'updated_at'>>;
      };
      website_content: {
        Row: WebsiteContent;
        Insert: Omit<WebsiteContent, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<WebsiteContent, 'id' | 'created_at' | 'updated_at'>>;
      };
      website_embeddings: {
        Row: WebsiteEmbedding;
        Insert: Omit<WebsiteEmbedding, 'id' | 'created_at'>;
        Update: Partial<Omit<WebsiteEmbedding, 'id' | 'created_at'>>;
      };
      chat_conversations: {
        Row: {
          id: string
          user_id: string
          chatbot_id: string | null
          visitor_session_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chatbot_id?: string | null
          visitor_session_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chatbot_id?: string | null
          visitor_session_id?: string
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
      }
    };
    Views: {
      [_ in never]: never
    };
    Functions: {
      [_ in never]: never
    };
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 