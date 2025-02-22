declare module '@langchain/openai' {
  export class OpenAI {
    constructor(config: {
      openAIApiKey: string;
      modelName: string;
      temperature: number;
    });
    call(prompt: string): Promise<string>;
  }
}

declare module '@langchain/google-vertexai' {
  export class GoogleVertexAI {
    constructor(config: {
      apiKey: string;
      model: string;
      temperature: number;
    });
    call(prompt: string): Promise<string>;
  }

  export class GoogleVertexAIEmbeddings {
    constructor(config: {
      apiKey: string;
    });
  }
}

declare module '@langchain/text-splitter' {
  export class RecursiveCharacterTextSplitter {
    constructor(config: {
      chunkSize: number;
      chunkOverlap: number;
    });
    createDocuments(texts: string[]): Promise<any[]>;
  }
}

declare module '@langchain/community/vectorstores/supabase' {
  import { SupabaseClient } from '@supabase/supabase-js';
  
  export class SupabaseVectorStore {
    constructor(
      embeddings: any,
      config: {
        client: SupabaseClient;
        tableName: string;
        queryName: string;
      }
    );
    addDocuments(documents: any[]): Promise<void>;
    similaritySearch(
      query: string,
      k: number,
      filter?: Record<string, any>
    ): Promise<any[]>;
  }
}

declare module '@langchain/openai/embeddings' {
  export class OpenAIEmbeddings {
    constructor(config: {
      openAIApiKey: string;
    });
  }
} 