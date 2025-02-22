'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';

interface ChatbotSettings {
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

interface ChatbotCustomizerProps {
  chatbotId: string;
  initialSettings: ChatbotSettings;
  onUpdate?: (settings: ChatbotSettings) => void;
}

const fontOptions = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Poppins', value: 'Poppins' }
];

const toneOptions = [
  { label: 'Professional', value: 'professional' },
  { label: 'Friendly', value: 'friendly' },
  { label: 'Casual', value: 'casual' }
];

export default function ChatbotCustomizer({ chatbotId, initialSettings, onUpdate }: ChatbotCustomizerProps) {
  const [settings, setSettings] = useState<ChatbotSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const supabase = createClientComponentClient();

  const handleSettingChange = (key: keyof ChatbotSettings, value: any) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    onUpdate?.(newSettings);
  };

  const handleLogoUpload = async (file: File) => {
    try {
      setUploadingLogo(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);

      handleSettingChange('logo', publicUrl);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let error;
      if (chatbotId === 'new') {
        // Create new chatbot
        const { error: createError } = await supabase
          .from('chatbots')
          .insert({
            user_id: user.id,
            name: settings.name,
            settings: settings
          });
        error = createError;
      } else {
        // Update existing chatbot
        const { error: updateError } = await supabase
          .from('chatbots')
          .update({
            name: settings.name,
            settings: settings
          })
          .eq('id', chatbotId)
          .eq('user_id', user.id);
        error = updateError;
      }

      if (error) throw error;
      
      toast.success('Settings saved successfully');
      onUpdate?.(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-700 p-8 space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Customize Your Chatbot</h2>
        <p className="text-text-secondary">Configure the look and feel of your AI assistant</p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Chatbot Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => handleSettingChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-[#121212] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              placeholder="e.g., Real Estate Assistant"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Your Name</label>
            <input
              type="text"
              value={settings.userName}
              onChange={(e) => handleSettingChange('userName', e.target.value)}
              className="w-full px-4 py-3 bg-[#121212] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              placeholder="e.g., John Smith"
            />
          </div>
        </div>

        {/* Color Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                className="h-10 w-10 cursor-pointer appearance-none border-none bg-transparent appearance-none p-0"
                />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                className="w-24 px-3 py-2 bg-[#121212] border border-gray-600 rounded-lg text-white"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white">Chat Background Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.chatBackgroundColor}
                onChange={(e) => handleSettingChange('chatBackgroundColor', e.target.value)}
                className="h-10 w-10 cursor-pointer appearance-none border-none bg-transparent appearance-none p-0"
              />
              <input
                type="text"
                value={settings.chatBackgroundColor}
                onChange={(e) => handleSettingChange('chatBackgroundColor', e.target.value)}
                className="w-24 px-3 py-2 bg-[#121212] border border-gray-600 rounded-lg text-white"
                placeholder="#1a1a1a"
              />
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Font Family</label>
            <div className="relative">
              <select
                value={settings.fontFamily}
                onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                className="w-full px-4 py-3 bg-[#121212] border border-gray-600 rounded-lg text-white appearance-none focus:ring-2 focus:ring-primary/50"
              >
                {fontOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">AI Tone</label>
            <div className="relative">
              <select
                value={settings.aiTone}
                onChange={(e) => handleSettingChange('aiTone', e.target.value as ChatbotSettings['aiTone'])}
                className="w-full px-4 py-3 bg-[#121212] border border-gray-600 rounded-lg text-white appearance-none focus:ring-2 focus:ring-primary/50"
              >
                {toneOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Logo</label>
          <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-6 text-center transition-colors hover:border-primary/50">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleLogoUpload(file);
                }
              }}
              disabled={uploadingLogo}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center">
              <svg className="h-10 w-10 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {uploadingLogo ? (
                <p className="text-sm text-gray-400">Uploading logo...</p>
              ) : (
                <>
                  <p className="text-sm text-gray-400">Drag and drop or click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, or SVG (max 5MB)</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all duration-300 ease-in-out transform hover:scale-[1.02] disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Chatbot Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}