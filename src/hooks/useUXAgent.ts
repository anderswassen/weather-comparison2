'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  ChatMessage,
  UXKnowledgeEntry,
  AppAnalysisResult,
  UserIntent,
  WebResearchResult,
} from '@/lib/ux-agent/types';
import {
  classifyIntent,
  generateResponse,
  createWelcomeMessage,
} from '@/lib/ux-agent/chat-engine';
import { analyzeAppUX } from '@/lib/ux-agent/analysis-engine';

const CHAT_STORAGE_KEY = 'ux-agent-chat';

export type ActiveTab = 'chat' | 'recommendations' | 'knowledge';

export interface UseUXAgentResult {
  isOpen: boolean;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  recommendations: AppAnalysisResult | null;
  knowledge: UXKnowledgeEntry[];
  chatMessages: ChatMessage[];
  sendMessage: (text: string) => void;
  runAnalysis: () => void;
  runResearch: (category?: string) => Promise<void>;
  isAnalyzing: boolean;
  isResearching: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadCount: number;
}

export function useUXAgent(): UseUXAgentResult {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [knowledge, setKnowledge] = useState<UXKnowledgeEntry[]>([]);
  const [recommendations, setRecommendations] =
    useState<AppAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // Initialize chat from localStorage
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        setChatMessages(JSON.parse(stored));
      } else {
        setChatMessages([createWelcomeMessage(language)]);
      }
    } catch {
      setChatMessages([createWelcomeMessage(language)]);
    }

    // Fetch knowledge base
    fetchKnowledge();
  }, [initialized, language]);

  // Persist chat messages
  useEffect(() => {
    if (chatMessages.length > 0 && initialized) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatMessages));
      } catch {
        // Storage full, ignore
      }
    }
  }, [chatMessages, initialized]);

  const fetchKnowledge = useCallback(async () => {
    try {
      const res = await fetch('/api/ux-agent/knowledge');
      if (res.ok) {
        const data = await res.json();
        setKnowledge(data.entries || []);
      }
    } catch {
      // Knowledge fetch failed silently
    }
  }, []);

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setUnreadCount(0);
      return !prev;
    });
  }, []);

  const openPanel = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const closePanel = useCallback(() => setIsOpen(false), []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // Add user message
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        text: trimmed,
        timestamp: new Date().toISOString(),
      };

      const intent = classifyIntent(trimmed);
      const agentMsg = generateResponse(
        intent,
        language,
        knowledge,
        recommendations,
      );

      setChatMessages((prev) => [...prev, userMsg, agentMsg]);

      // Handle special intents
      if (intent === 'trigger-analysis') {
        runAnalysis();
      } else if (intent === 'trigger-research') {
        runResearch();
      }
    },
    [language, knowledge, recommendations],
  );

  const runAnalysis = useCallback(() => {
    setIsAnalyzing(true);

    // Simulate a brief delay for UX feel
    setTimeout(() => {
      const result = analyzeAppUX();
      setRecommendations(result);
      setIsAnalyzing(false);

      if (!isOpen) {
        setUnreadCount((prev) => prev + result.recommendations.filter((r) => !r.passed).length);
      }
    }, 500);
  }, [isOpen]);

  const runResearch = useCallback(
    async (category?: string) => {
      setIsResearching(true);
      try {
        const url = category
          ? `/api/ux-agent/research?category=${category}`
          : '/api/ux-agent/research';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          // Refresh knowledge after research
          await fetchKnowledge();

          const totalInsights =
            data.summary?.totalInsights || 0;

          if (!isOpen && totalInsights > 0) {
            setUnreadCount((prev) => prev + totalInsights);
          }
        }
      } catch {
        // Research failed
      } finally {
        setIsResearching(false);
      }
    },
    [fetchKnowledge, isOpen],
  );

  return {
    isOpen,
    togglePanel,
    openPanel,
    closePanel,
    recommendations,
    knowledge,
    chatMessages,
    sendMessage,
    runAnalysis,
    runResearch,
    isAnalyzing,
    isResearching,
    activeTab,
    setActiveTab,
    unreadCount,
  };
}
