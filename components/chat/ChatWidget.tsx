'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  options?: string[];
}

interface UserData {
  flow: string;
  location?: string;
  propertyType?: string;
  budget?: string;
  email?: string;
  phone?: string;
  name?: string;
  contactTime?: string;
}

interface ChatWidgetProps {
  settings?: {
    name: string;
    chatbotName: string;
    userName: string;
    primaryColor: string;
    chatBackgroundColor: string;
    fontFamily: string;
    aiTone: 'professional' | 'friendly' | 'casual';
    predefinedQuestions: string[];
    logo?: string;
  },
  user_id?: string;
  isEmbedded?: boolean;

}

const ChatWidget: React.FC<ChatWidgetProps> = ({ settings, user_id }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userData, setUserData] = useState<UserData>({ flow: '' });
  const [currentStep, setCurrentStep] = useState('INITIAL');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MAIN_OPTIONS = ['Buy a Property', 'Sell a Property', 'Rent a Property', 'Other'];

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = settings?.predefinedQuestions?.length 
        ? "How may we help you today? Here are some common questions:"
        : "How may we help you today?";

      setMessages([]);
      
      addMessage({ 
        content: greeting, 
        isUser: false, 
        options: settings?.predefinedQuestions?.length 
          ? [...MAIN_OPTIONS, ...settings.predefinedQuestions]
          : MAIN_OPTIONS 
      });
    }
  }, [settings?.predefinedQuestions]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (msg: Omit<Message, 'id'>) => {
    let content = msg.content;
    
    // Apply AI tone for non-user messages
    if (!msg.isUser && settings?.aiTone) {
      content = formatByTone(content, settings.aiTone);
    }
  
    const newMessage = { 
      ...msg, 
      content,
      id: Math.random().toString() 
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  const formatByTone = (message: string, tone: 'professional' | 'friendly' | 'casual'): string => {
    switch (tone) {
      case 'professional':
        return message.replace(/Hey|Hi there/g, 'Hello')
                     .replace(/Thanks/g, 'Thank you')
                     .replace(/Sure/g, 'Certainly');
      case 'friendly':
        return message.replace(/Hello/g, 'Hi there')
                     .replace(/Thank you/g, 'Thanks')
                     .replace(/Certainly/g, 'Sure');
      case 'casual':
        return message.replace(/Hello/g, 'Hey')
                     .replace(/Thank you/g, 'Thanks')
                     .replace(/Certainly/g, 'Sure');
      default:
        return message;
    }
  };

  const handleFlow = async (flow: string, step: string, input?: string) => {
    switch (flow) {
      case 'BUY':
        switch (step) {
          case 'START':
            addMessage({ content: "Great! Let me help you find your dream home. What location are you interested in?", isUser: false });
            setCurrentStep('LOCATION_INPUT');
            break;
          case 'LOCATION_INPUT':
            setUserData(prev => ({ ...prev, location: input }));
            addMessage({ 
              content: "What type of property are you looking for?", 
              isUser: false,
              options: ["House", "Apartment", "Condo", "Other"]
            });
            setCurrentStep('PROPERTY_TYPE_SELECTION');
            break;
          case 'PROPERTY_TYPE_SELECTION':
            setUserData(prev => ({ ...prev, propertyType: input }));
            if (input === 'Other') {
              addMessage({ content: "Please describe the type of property you're looking for:", isUser: false });
              setCurrentStep('PROPERTY_DESCRIPTION');
            } else {
              handleAgentContact();
            }
            break;
          case 'PROPERTY_DESCRIPTION':
            setUserData(prev => ({ ...prev, propertyType: input }));
            handleAgentContact();
            break;
          case 'AGENT_CONTACT_PROMPT':
            if (input === 'Yes') {
              collectContactDetails();
            } else {
              addMessage({ 
                content: "Is there anything else you'd like help with?",
                isUser: false,
                options: ["Yes", "No"]
              });
              setCurrentStep('ADDITIONAL_HELP');
            }
            break;
          case 'COLLECT_EMAIL':
            setUserData(prev => ({ ...prev, email: input }));
            addMessage({ content: "Please provide your phone number:", isUser: false });
            setCurrentStep('COLLECT_PHONE');
            break;
          case 'COLLECT_PHONE':
            setUserData(prev => ({ ...prev, phone: input }));
            addMessage({ content: "What is your name?", isUser: false });
            setCurrentStep('COLLECT_NAME');
            break;
          case 'COLLECT_NAME':
            setUserData(prev => ({ ...prev, name: input }));
            addMessage({ content: "What is the best time for our agent to contact you?", isUser: false });
            setCurrentStep('COLLECT_TIME');
            break;
          case 'COLLECT_TIME':
            setUserData(prev => ({ ...prev, contactTime: input }));
            const storedContact = await storeContactDetails(userData);
            if (storedContact) {
              addMessage({ 
                content: "Thank you! Our agent will contact you soon using the details you provided.", 
                isUser: false 
              });
            }            
            setCurrentStep('END');
          case 'ADDITIONAL_HELP':
            if (input === 'Yes') {
              addMessage({ content: "Please describe what you'd like to know:", isUser: false });
              setCurrentStep('CHECK_KNOWLEDGE_BASE');
            } else {
              addMessage({ content: "Thank you for your interest. Have a great day!", isUser: false });
              setCurrentStep('END');
            }
            break;
          case 'CHECK_KNOWLEDGE_BASE':
            const response = await checkKnowledgeBase(input || '');
            if (response) {
              addMessage({ content: response, isUser: false });
              handleAgentContact();
            } else {
              addMessage({ content: "Sorry, we can't help with that.", isUser: false });
              handleAgentContact();
            }
            break;
        }
        break;

      case 'SELL':
        switch (step) {
          case 'START':
            addMessage({ content: "Great, where is the property located?", isUser: false });
            setCurrentStep('SELL_LOCATION_INPUT');
            break;
          case 'SELL_LOCATION_INPUT':
            setUserData(prev => ({ ...prev, location: input }));
            addMessage({ 
              content: "Would you like to schedule a property valuation or learn more about the selling process?",
              isUser: false,
              options: ["Schedule property valuation", "Learn about the selling process", "Talk to an agent"]
            });
            setCurrentStep('SELL_OPTIONS');
            break;
          case 'SELL_OPTIONS':
            if (input === 'Schedule property valuation') {
              addMessage({ content: "When would be a good time for the valuation?", isUser: false });
              setCurrentStep('SELL_VALUATION');
            } else if (input === 'Learn about the selling process') {
              const response = await checkKnowledgeBase('selling process');
              addMessage({ 
                content: response || "Here are the key steps in our selling process:\n1. Property Valuation\n2. Market Analysis\n3. Property Marketing\n4. Viewings & Offers\n5. Sale Completion\n\nWould you like to speak with an agent to learn more?",
                isUser: false,
                options: ["Yes", "No"]
              });
              setCurrentStep('SELL_PROCESS');
            } else {
              collectContactDetails();
            }
            break;
          case 'SELL_VALUATION':
            setUserData(prev => ({ ...prev, valuationTime: input }));
            collectContactDetails();
            break;
          case 'SELL_PROCESS':
            if (input === 'Yes') {
              collectContactDetails();
            } else {
              addMessage({ content: "Thank you for your interest. Have a great day!", isUser: false });
              setCurrentStep('END');
            }
            break;
          case 'COLLECT_EMAIL':
            setUserData(prev => ({ ...prev, email: input }));
            addMessage({ content: "Please provide your phone number:", isUser: false });
            setCurrentStep('COLLECT_PHONE');
            break;
          case 'COLLECT_PHONE':
            setUserData(prev => ({ ...prev, phone: input }));
            addMessage({ content: "What is your name?", isUser: false });
            setCurrentStep('COLLECT_NAME');
            break;
          case 'COLLECT_NAME':
            setUserData(prev => ({ ...prev, name: input }));
            addMessage({ content: "What is the best time for our agent to contact you?", isUser: false });
            setCurrentStep('COLLECT_TIME');
            break;
          case 'COLLECT_TIME':
            setUserData(prev => ({ ...prev, contactTime: input }));
            const storedContact = await storeContactDetails(userData);
            if (storedContact) {
              addMessage({ 
                content: "Thank you! Our agent will contact you soon using the details you provided.", 
                isUser: false 
              });
            }            
            setCurrentStep('END');
            break;
        }
        break;

      case 'RENT':
        switch (step) {
          case 'START':
            addMessage({ 
              content: "I can help you find the perfect rental. What is your preferred monthly budget?",
              isUser: false,
              options: ["Under $1,000", "$1,000 - $2,000", "$2,000 - $3,000", "Above $3,000"]
            });
            setCurrentStep('RENT_BUDGET');
            break;
          case 'RENT_BUDGET':
            setUserData(prev => ({ ...prev, budget: input }));
            addMessage({ content: "Great! Which location are you interested in?", isUser: false });
            setCurrentStep('RENT_LOCATION');
            break;
          case 'RENT_LOCATION':
            setUserData(prev => ({ ...prev, location: input }));
            addMessage({ 
              content: "What type of property are you looking for?",
              isUser: false,
              options: ["House", "Apartment", "Condo", "Other"]
            });
            setCurrentStep('RENT_TYPE');
            break;
          case 'RENT_TYPE':
            setUserData(prev => ({ ...prev, propertyType: input }));
            handleAgentContact();
            break;
          case 'AGENT_CONTACT_PROMPT':
            if (input === 'Yes') {
              collectContactDetails();
            } else {
              addMessage({ 
                content: "Is there anything else you'd like help with?",
                isUser: false,
                options: ["Yes", "No"]
              });
              setCurrentStep('ADDITIONAL_HELP');
            }
            break;
          case 'COLLECT_EMAIL':
            setUserData(prev => ({ ...prev, email: input }));
            addMessage({ content: "Please provide your phone number:", isUser: false });
            setCurrentStep('COLLECT_PHONE');
            break;
          case 'COLLECT_PHONE':
            setUserData(prev => ({ ...prev, phone: input }));
            addMessage({ content: "What is your name?", isUser: false });
            setCurrentStep('COLLECT_NAME');
            break;
          case 'COLLECT_NAME':
            setUserData(prev => ({ ...prev, name: input }));
            addMessage({ content: "What is the best time for our agent to contact you?", isUser: false });
            setCurrentStep('COLLECT_TIME');
            break;
          case 'COLLECT_TIME':
            setUserData(prev => ({ ...prev, contactTime: input }));
            const storedContact = await storeContactDetails(userData);
            if (storedContact) {
              addMessage({ 
                content: "Thank you! Our agent will contact you soon using the details you provided.", 
                isUser: false 
              });
            }            
            setCurrentStep('END');
          case 'ADDITIONAL_HELP':
            if (input === 'Yes') {
              addMessage({ content: "Please describe what you'd like to know:", isUser: false });
              setCurrentStep('CHECK_KNOWLEDGE_BASE');
            } else {
              addMessage({ content: "Thank you for your interest. Have a great day!", isUser: false });
              setCurrentStep('END');
            }
            break;
          case 'CHECK_KNOWLEDGE_BASE':
            const response = await checkKnowledgeBase(input || '');
            if (response) {
              addMessage({ content: response, isUser: false });
              handleAgentContact();
            } else {
              addMessage({ content: "Sorry, we can't help with that.", isUser: false });
              handleAgentContact();
            }
            break;
        }
        break;

      case 'OTHER':
        switch (step) {
          case 'START':
            addMessage({ content: "Sure, what would you like to know?", isUser: false });
            setCurrentStep('GENERAL_QUERY');
            break;
          case 'GENERAL_QUERY':
            const response = await checkKnowledgeBase(input || '');
            if (response) {
              addMessage({ content: response, isUser: false });
              handleAgentContact();
            } else {
              addMessage({ content: "Sorry, we can't help with that.", isUser: false });
              handleAgentContact();
            }
            break;
          case 'AGENT_CONTACT_PROMPT':
            if (input === 'Yes') {
              collectContactDetails();
            } else {
              addMessage({ content: "Thank you for your interest. Have a great day!", isUser: false });
              setCurrentStep('END');
            }
            break;
          case 'COLLECT_EMAIL':
            setUserData(prev => ({ ...prev, email: input }));
            addMessage({ content: "Please provide your phone number:", isUser: false });
            setCurrentStep('COLLECT_PHONE');
            break;
          case 'COLLECT_PHONE':
            setUserData(prev => ({ ...prev, phone: input }));
            addMessage({ content: "What is your name?", isUser: false });
            setCurrentStep('COLLECT_NAME');
            break;
          case 'COLLECT_NAME':
            setUserData(prev => ({ ...prev, name: input }));
            addMessage({ content: "What is the best time for our agent to contact you?", isUser: false });
            setCurrentStep('COLLECT_TIME');
            break;
          case 'COLLECT_TIME':
            setUserData(prev => ({ ...prev, contactTime: input }));
            const storedContact = await storeContactDetails(userData);
            if (storedContact) {
              addMessage({ 
                content: "Thank you! Our agent will contact you soon using the details you provided.", 
                isUser: false 
              });
            }            
            setCurrentStep('END');
        }
        break;
    }
  };

  const handleAgentContact = () => {
    addMessage({ 
      content: "Would you like to speak with one of our agents for more information?",
      isUser: false,
      options: ["Yes", "No"]
    });
    setCurrentStep('AGENT_CONTACT_PROMPT');
  };

  const collectContactDetails = () => {
    addMessage({ content: "Please provide your email address:", isUser: false });
    setCurrentStep('COLLECT_EMAIL');
  };

  const handleUserInput = async (input: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
  
    addMessage({ content: input, isUser: true });
  
    // Check if we're in the END state and restart the conversation
    if (currentStep === 'END' || currentStep === '') {
      // Reset to initial state
      setCurrentStep('INITIAL');
      setUserData({ flow: '' });
      
      // Add initial greeting message again
      const greeting = settings?.predefinedQuestions?.length 
        ? "How may we help you today? Here are some common questions:"
        : "How may we help you today?";
      
      addMessage({ 
        content: greeting, 
        isUser: false, 
        options: settings?.predefinedQuestions?.length 
          ? [...MAIN_OPTIONS, ...settings.predefinedQuestions]
          : MAIN_OPTIONS 
      });
    }
  
    if (currentStep === 'INITIAL') {
      const flowMap: { [key: string]: string } = {
        'Buy a Property': 'BUY',
        'Sell a Property': 'SELL',
        'Rent a Property': 'RENT',
        'Other': 'OTHER'
      };
      const selectedFlow = flowMap[input];
      if (selectedFlow) {
        setUserData(prev => ({ ...prev, flow: selectedFlow }));
        await handleFlow(selectedFlow, 'START');
      }
    } else {
      await handleFlow(userData.flow, currentStep, input);
    }
  
    setIsProcessing(false);
  };

  const checkKnowledgeBase = async (query: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/knowledge-base/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          user_id// Use the passed userId
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to query knowledge base');
      }
  
      const result = await response.json();
      
      if (result.noInformation) {
        return null;
      }
  
      return result.answer;
    } catch (error) {
      console.error('Error querying knowledge base:', error);
      return null;
    }
  };

  const storeContactDetails = async (userData: UserData) => {
    try {
      const response = await fetch('/api/store-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          flow: userData.flow,
          location: userData.location,
          propertyType: userData.propertyType,
          budget: userData.budget,
          email: userData.email,
          phone: userData.phone,
          name: userData.name,
          contactTime: userData.contactTime,
          userId: user_id // Optional user identifier
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to store contact details');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error storing contact details:', error);
      // Optionally show an error message to the user
      addMessage({ 
        content: "There was an issue saving your information. Our agent will still contact you.", 
        isUser: false 
      });
      return null;
    }
  };

  return (
    <div 
      className="flex flex-col h-[600px] rounded-2xl shadow-2xl overflow-hidden"
      style={{ 
        backgroundColor: settings?.chatBackgroundColor || '#1e1e1e',
        fontFamily: settings?.fontFamily || 'Inter'
      }}
    >
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between shadow-md transition-colors duration-300"
        style={{ 
          backgroundColor: settings?.primaryColor || '#5d52f9',
          color: settings?.primaryColor && settings.primaryColor.toLowerCase() === '#ffffff' ? 'black' : 'white'
        }}
      >
        <div className="flex items-center space-x-3">
          {settings?.logo && (
            <img 
              src={settings.logo} 
              alt="Logo" 
              className="w-10 h-10 rounded-full border-2 border-white/20 object-cover" 
            />
          )}
          <h2 className="text-lg font-bold">
            {settings?.name || 'Chat Assistant'}
          </h2>
        </div>
        {settings?.chatbotName && (
          <span className="text-sm opacity-80">
            {settings.chatbotName}
          </span>
        )}
      </div>
  
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#121212] scrollbar-thin scrollbar-track-[#1e1e1e] scrollbar-thumb-primary/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl shadow-lg transition-all duration-300 ${
                message.isUser 
                  ? 'bg-primary text-black' 
                  : 'bg-[#2a2a2a] text-white'
              }`}
              style={{
                backgroundColor: message.isUser 
                  ? settings?.primaryColor || '#5d52f9'
                  : '#2a2a2a'
              }}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              {!message.isUser && settings?.chatbotName && (
                <p className="text-xs mt-1 opacity-70">{settings.chatbotName}</p>
              )}
              {message.options && (
                <div className="mt-3 space-y-2">
                  {message.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleUserInput(option)}
                      className="w-full p-2 text-sm text-left bg-black/20 hover:bg-black/30 rounded-lg transition-colors duration-300"
                      disabled={isProcessing}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
  
      {/* Input */}
      <div className="p-4 bg-[#121212] border-t border-gray-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.target as HTMLFormElement).elements.namedItem('message') as HTMLInputElement;
            if (input.value.trim()) {
              handleUserInput(input.value);
              input.value = '';
            }
          }}
          className="flex space-x-3 items-center"
        >
          <input
            type="text"
            name="message"
            placeholder="Type your message..."
            className="flex-1 p-3 bg-[#2a2a2a] text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/50 transition-all duration-300"
            disabled={isProcessing || Boolean(messages[messages.length - 1]?.options?.length)}
          />
          <button
            type="submit"
            className="p-3 bg-primary text-white rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            style={{ backgroundColor: settings?.primaryColor || '#5d52f9' }}
            disabled={isProcessing || Boolean(messages[messages.length - 1]?.options?.length)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;