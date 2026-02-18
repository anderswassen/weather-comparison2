'use client';

import { useState, useRef, useEffect } from 'react';
import { useUXAgentContext } from '@/context/UXAgentContext';
import { useLanguage } from '@/context/LanguageContext';
import { UXAgentResearchStatus } from './UXAgentResearchStatus';

const QUICK_ACTIONS = [
  { labelKey: 'uxAgent.chat.quickAnalyze', message: 'analyze this app' },
  { labelKey: 'uxAgent.chat.quickResearch', message: 'research UX trends' },
  { labelKey: 'uxAgent.chat.quickHowCompare', message: 'how do I compare weather?' },
  { labelKey: 'uxAgent.chat.quickAccessibility', message: 'accessibility tips' },
];

export function UXAgentChat() {
  const {
    chatMessages,
    sendMessage,
    isAnalyzing,
    isResearching,
  } = useUXAgentContext();
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}
            >
              {msg.text.split('\n').map((line, i) => (
                <span key={i}>
                  {line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <strong key={j}>{part.slice(2, -2)}</strong>
                      );
                    }
                    return <span key={j}>{part}</span>;
                  })}
                  {i < msg.text.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}

        {(isAnalyzing || isResearching) && <UXAgentResearchStatus />}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-1.5 border-t border-gray-200 px-4 py-2 dark:border-gray-700">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.labelKey}
            onClick={() => sendMessage(action.message)}
            disabled={isAnalyzing || isResearching}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t(action.labelKey)}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('uxAgent.chat.placeholder')}
            disabled={isAnalyzing || isResearching}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isAnalyzing || isResearching}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400"
            aria-label={t('uxAgent.chat.send')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m22 2-7 20-4-9-9-4z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
