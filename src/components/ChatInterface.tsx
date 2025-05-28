import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getResponseForInput } from '../data/chatResponses';
import { Send, MessageCircle } from 'lucide-react';

interface ChatInterfaceProps {
  onChatQuery: (query: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onChatQuery }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'Welcome! Ask me anything about Seattle neighborhoods - population, demographics, income levels, or specific areas like Capitol Hill, Ballard, or South Lake Union.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    onChatQuery(inputValue);
    setInputValue('');
    
    setTimeout(() => {
      const responseContent = getResponseForInput(inputValue);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col transition-all duration-300 ease-in-out ${
      isExpanded ? 'h-[500px]' : 'h-[300px]'
    }`}>
      <div className="flex items-center justify-between bg-indigo-600 dark:bg-indigo-800 text-white rounded-t-lg p-3">
        <h3 className="font-semibold flex items-center">
          <MessageCircle size={18} className="mr-2" />
          Seattle Neighborhoods Assistant
        </h3>
        <button 
          onClick={toggleExpand}
          className="text-indigo-100 hover:text-white transition-colors"
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-3 ${
              message.role === 'user' 
                ? 'text-right' 
                : 'text-left'
            }`}
          >
            <div className={`inline-block max-w-[80%] px-3 py-2 rounded-lg ${
              message.role === 'user'
                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                : message.role === 'system'
                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
            }`}>
              {message.content}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about Seattle neighborhoods..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
          />
          <button 
            type="submit"
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;