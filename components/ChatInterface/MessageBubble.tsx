import React from 'react';
import { ChatMessage } from '../../types';

interface Props {
  msg: ChatMessage;
  isNovelty?: boolean;
}

export const MessageBubble: React.FC<Props> = ({ msg, isNovelty }) => {
  const isUser = msg.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm
        ${isUser 
          ? 'bg-brand-600 text-white rounded-br-none' 
          : 'bg-gray-100 dark:bg-dark-900 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700'
        }
      `}>
        <div className="whitespace-pre-wrap">{msg.content}</div>
        
        <div className="mt-2 pt-2 border-t border-white/20 dark:border-gray-700 flex gap-2 text-xs opacity-75">
            {!isUser && msg.relatedMemoryIds && (
              <span>{msg.relatedMemoryIds.length} Graph Refs</span>
            )}
            {isNovelty && (
              <span className="text-purple-200">Novelty Detected</span>
            )}
        </div>
      </div>
    </div>
  );
};
