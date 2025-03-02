'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface KnowledgeSource {
  id: string;
  name: string;
  status: 'processing' | 'active' | 'error';
  lastUpdated: Date;
}

export default function KnowledgeBasePage() {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      setIsLoading(true); // Ensure loading starts
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }
      const { data: knowledgeData, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (knowledgeData) {
        setSources(knowledgeData.map(item => ({
          id: item.id,
          name: item.file_name,
          status: 'active',
          lastUpdated: new Date(item.created_at)
        })));
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
      toast.error('Failed to load knowledge sources');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/rtf',
      'application/rtf',
      'application/x-rtf',
      'text/richtext'
    ];
  
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only text documents are supported (.txt, .pdf, .doc, .docx, .rtf)');
      return;
    }
  
    try {
      setIsUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
  
      // Create temporary source
      const tempSource: KnowledgeSource = {
        id: Math.random().toString(),
        name: file.name,
        status: 'processing',
        lastUpdated: new Date(),
      };
      setSources(prev => [...prev, tempSource]);
  
      // Use FormData to properly handle binary files
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('userId', user.id);
  
      // Send to your API route using FormData
      const response = await fetch('/api/knowledge-base/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
  
      const result = await response.json();
  
      // Update source status
      setSources(prev =>
        prev.map(source =>
          source.id === tempSource.id
            ? { ...source, id: result.id, status: 'active' }
            : source
        )
      );
  
      toast.success('File processed and added to knowledge base!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to process file');
      // Remove the temporary source if there's an error
      setSources(prev => prev.filter(source => source.id !== source.id));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const response = await fetch('/api/knowledge-base/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceId: id,
          userId: user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete source');
      }

      setSources(prev => prev.filter(source => source.id !== id));
      toast.success('Source removed successfully!');
    } catch (error) {
      console.error('Error deleting source:', error);
      toast.error('Failed to remove source');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Knowledge Base</h1>
        <div className="flex gap-4">
          <label
            htmlFor="file-upload"
            className={`relative inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".txt,.pdf,.doc,.docx,.rtf"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Knowledge Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((source) => (
          <div
            key={source.id}
            className="relative bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden border border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            {/* Date Badge */}
            <div className="absolute top-4 right-4 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">
              {formatDistanceToNow(source.lastUpdated, { addSuffix: true })}
            </div>

            <div className="p-6 mt-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex items-center space-x-2 min-w-0 gap-14">
                  <h3 className="text-lg font-bold text-white truncate">{source.name}</h3>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      source.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : source.status === 'processing'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {source.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-text-secondary">
                  Updated {source.lastUpdated.toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleDelete(source.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sources.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-text-secondary mb-2">No knowledge sources yet</h3>
          <p className="text-text-secondary mb-4">Upload a file to get started</p>
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer"
          >
            Upload First File
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".txt,.pdf,.doc,.docx,.rtf"
            />
          </label>
        </div>
      )}
    </div>
  );
}