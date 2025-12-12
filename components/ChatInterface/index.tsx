import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '../../hooks/useChat';
import { MessageBubble } from './MessageBubble';

export const ChatInterface: React.FC = () => {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    input, 
    setInput, 
    isLoading, 
    isTraining,
    trainingFact, // New prop exposed from hook
    sendMessage 
  } = useChat();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTraining]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
      
      {/* Training Indicator (Perceptual Memory) */}
      {isTraining && (
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1 pointer-events-none">
            <div className="flex items-center gap-2 bg-white dark:bg-dark-900 shadow px-3 py-1.5 rounded-full border border-purple-200 dark:border-purple-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                    {t('chat.training')}
                </span>
            </div>
            {trainingFact && (
                <div className="bg-purple-50 dark:bg-purple-900/40 backdrop-blur-sm px-3 py-1 rounded-lg border border-purple-100 dark:border-purple-800/50 max-w-xs">
                    <p className="text-[10px] text-purple-800 dark:text-purple-200 line-clamp-2">
                        Learning: "{trainingFact}"
                    </p>
                </div>
            )}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
           <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
             <div className="w-16 h-16 bg-brand-100 dark:bg-dark-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
             </div>
             <p>Mnemosyne System Ready</p>
             <p className="text-xs mt-2">Perceptual Memory Active</p>
           </div>
        )}
        
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} isNovelty={!!msg.noveltyScore} />
        ))}
        
        {isLoading && (
            <div className="flex justify-start px-5">
                 <div className="bg-gray-100 dark:bg-dark-900 rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                 </div>
            </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-dark-800">
        <form onSubmit={handleSubmit} className="relative">
           <input 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-500 dark:text-white transition-all"
             placeholder={t('chat.placeholder')}
             disabled={isLoading}
           />
           <button 
             type="submit"
             disabled={!input.trim() || isLoading}
             className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </button>
        </form>
      </div>
    </div>
  );
};