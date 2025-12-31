'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpaceBackground } from '@/components/SpaceBackground';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  MessageSquare, Send, Bot, User, Copy, RotateCw, ThumbsUp, ThumbsDown,
  Settings, ChevronDown, ChevronUp, Download, Trash2, Plus, X, Maximize2,
  Minimize2, Sparkles, StopCircle, Paperclip, Code, CheckCheck, MessageCircle,
  Zap, Clock, Cpu, Save, FileJson, FileText, ChevronRight, Menu, PanelLeftClose
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type MessageRole = 'user' | 'assistant' | 'system';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  feedback?: 'up' | 'down';
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

// ============================================================================
// MOCK DATA & UTILITIES
// ============================================================================

const SUGGESTED_PROMPTS = [
  { icon: Code, text: "Help me debug this TypeScript error", category: "Debug" },
  { icon: Sparkles, text: "Explain how async/await works", category: "Learn" },
  { icon: Zap, text: "Generate a React component", category: "Create" },
  { icon: CheckCheck, text: "Review my code for best practices", category: "Review" },
  { icon: FileText, text: "Write unit tests for this function", category: "Test" }
];

const MODELS = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Best for complex tasks' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced performance' },
  { id: 'llama-3-70b', name: 'Llama 3 70B', description: 'Open-source powerhouse' },
  { id: 'mistral-large', name: 'Mistral Large', description: 'Fast and efficient' }
];

const DEFAULT_SETTINGS: ChatSettings = {
  model: 'claude-3-sonnet',
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt: 'You are a helpful AI coding assistant. Provide clear, concise answers with code examples when relevant.'
};

// Mock responses for demonstration
const MOCK_RESPONSES: Record<string, string> = {
  debug: "I'd be happy to help debug your TypeScript error! Here's a systematic approach:\n\n```typescript\n// Common TypeScript errors and fixes:\n\n// 1. Type mismatch\nconst value: string = 42; // ❌ Error\nconst value: string = \"42\"; // ✅ Fixed\n\n// 2. Property doesn't exist\ninterface User {\n  name: string;\n}\nconst user: User = { name: \"John\", age: 30 }; // ❌\n\n// Fix: Extend interface\ninterface User {\n  name: string;\n  age?: number; // Optional property\n}\n```\n\nCould you share the specific error message you're seeing?",

  async: "Great question! `async/await` is syntactic sugar for working with Promises in JavaScript:\n\n```javascript\n// Traditional Promise chain\nfetchUser(id)\n  .then(user => fetchPosts(user.id))\n  .then(posts => console.log(posts))\n  .catch(error => console.error(error));\n\n// Same with async/await\nasync function getUserPosts(id) {\n  try {\n    const user = await fetchUser(id);\n    const posts = await fetchPosts(user.id);\n    console.log(posts);\n  } catch (error) {\n    console.error(error);\n  }\n}\n```\n\n**Key concepts:**\n- `async` makes a function return a Promise\n- `await` pauses execution until Promise resolves\n- Makes asynchronous code look synchronous\n- Use try/catch for error handling",

  component: "Here's a modern React component with TypeScript and best practices:\n\n```tsx\nimport React, { useState } from 'react';\nimport { motion } from 'framer-motion';\n\ninterface UserCardProps {\n  name: string;\n  role: string;\n  avatarUrl?: string;\n  onContact?: () => void;\n}\n\nexport function UserCard({ \n  name, \n  role, \n  avatarUrl, \n  onContact \n}: UserCardProps) {\n  const [isHovered, setIsHovered] = useState(false);\n\n  return (\n    <motion.div\n      whileHover={{ scale: 1.02, y: -4 }}\n      className=\"glass rounded-lg p-6\"\n      onHoverStart={() => setIsHovered(true)}\n      onHoverEnd={() => setIsHovered(false)}\n    >\n      <div className=\"flex items-center gap-4\">\n        <div className=\"relative\">\n          <img \n            src={avatarUrl || '/default-avatar.png'} \n            alt={name}\n            className=\"w-16 h-16 rounded-full\"\n          />\n          {isHovered && (\n            <motion.div \n              initial={{ scale: 0 }}\n              animate={{ scale: 1 }}\n              className=\"absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full\"\n            />\n          )}\n        </div>\n        \n        <div className=\"flex-1\">\n          <h3 className=\"text-lg font-semibold terminal-glow\">{name}</h3>\n          <p className=\"text-sm text-muted-foreground\">{role}</p>\n        </div>\n        \n        {onContact && (\n          <button\n            onClick={onContact}\n            className=\"px-4 py-2 bg-primary text-primary-foreground rounded-md\"\n          >\n            Contact\n          </button>\n        )}\n      </div>\n    </motion.div>\n  );\n}\n```\n\nThis component includes:\n- ✅ TypeScript props interface\n- ✅ Optional props with sensible defaults\n- ✅ Framer Motion animations\n- ✅ Glassmorphic styling\n- ✅ Responsive hover states",

  review: "I'll review your code for best practices. Here are key areas I look for:\n\n**✅ Good Practices:**\n```typescript\n// 1. Descriptive naming\nconst calculateUserAge = (birthDate: Date) => {...}\n\n// 2. Single responsibility\nfunction validateEmail(email: string): boolean {...}\nfunction sendEmail(to: string, subject: string) {...}\n\n// 3. Early returns\nfunction processUser(user: User | null) {\n  if (!user) return null;\n  if (!user.isActive) return null;\n  \n  // Main logic here\n  return processActiveUser(user);\n}\n\n// 4. Const over let\nconst items = [1, 2, 3];\n\n// 5. Type safety\ninterface Config {\n  apiKey: string;\n  timeout: number;\n}\n```\n\n**❌ Anti-patterns to avoid:**\n- Deep nesting (> 3 levels)\n- Magic numbers without constants\n- Mutating function parameters\n- Overly long functions (> 50 lines)\n- Missing error handling\n\nShare your code and I'll provide specific feedback!",

  tests: "Here's how to write comprehensive unit tests:\n\n```typescript\nimport { describe, it, expect, vi } from 'vitest';\nimport { render, screen, fireEvent } from '@testing-library/react';\nimport { UserCard } from './UserCard';\n\ndescribe('UserCard', () => {\n  it('renders user information correctly', () => {\n    render(\n      <UserCard \n        name=\"John Doe\" \n        role=\"Developer\" \n      />\n    );\n    \n    expect(screen.getByText('John Doe')).toBeInTheDocument();\n    expect(screen.getByText('Developer')).toBeInTheDocument();\n  });\n  \n  it('calls onContact when button is clicked', () => {\n    const mockOnContact = vi.fn();\n    \n    render(\n      <UserCard \n        name=\"John Doe\" \n        role=\"Developer\"\n        onContact={mockOnContact}\n      />\n    );\n    \n    fireEvent.click(screen.getByText('Contact'));\n    expect(mockOnContact).toHaveBeenCalledTimes(1);\n  });\n  \n  it('uses default avatar when none provided', () => {\n    render(<UserCard name=\"John\" role=\"Dev\" />);\n    \n    const avatar = screen.getByAltText('John');\n    expect(avatar).toHaveAttribute('src', '/default-avatar.png');\n  });\n});\n```\n\n**Testing best practices:**\n- Test behavior, not implementation\n- Use descriptive test names\n- Follow AAA pattern (Arrange, Act, Assert)\n- Mock external dependencies\n- Aim for high coverage of critical paths",

  default: "I'm here to help! I can assist with:\n\n🐛 **Debugging** - Fix errors and issues in your code\n📚 **Learning** - Explain concepts and best practices\n⚡ **Coding** - Generate components and functions\n✅ **Review** - Analyze code quality and suggest improvements\n🧪 **Testing** - Write unit and integration tests\n\nWhat would you like to work on?"
};

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getResponseForPrompt(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('debug') || lowerPrompt.includes('error')) return MOCK_RESPONSES.debug;
  if (lowerPrompt.includes('async') || lowerPrompt.includes('await')) return MOCK_RESPONSES.async;
  if (lowerPrompt.includes('component') || lowerPrompt.includes('react')) return MOCK_RESPONSES.component;
  if (lowerPrompt.includes('review') || lowerPrompt.includes('best practice')) return MOCK_RESPONSES.review;
  if (lowerPrompt.includes('test') || lowerPrompt.includes('unit test')) return MOCK_RESPONSES.tests;

  return MOCK_RESPONSES.default;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 px-4 py-3 glass rounded-lg w-fit"
    >
      <Bot className="h-4 w-4 text-primary" />
      <div className="flex gap-1">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 bg-primary rounded-full"
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 bg-primary rounded-full"
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 bg-primary rounded-full"
        />
      </div>
    </motion.div>
  );
}

interface MessageBubbleProps {
  message: Message;
  onCopy: () => void;
  onRegenerate: () => void;
  onFeedback: (type: 'up' | 'down') => void;
}

function MessageBubble({ message, onCopy, onRegenerate, onFeedback }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple markdown rendering for code blocks
  const renderContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <p key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {content.slice(lastIndex, match.index)}
          </p>
        );
      }

      // Add code block
      const language = match[1] || 'text';
      const code = match[2];
      parts.push(
        <div key={`code-${match.index}`} className="my-3 rounded-lg overflow-hidden border border-border/40">
          <div className="bg-muted/30 px-4 py-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">{language}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(code)}
              className="h-6 px-2"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <pre className="p-4 overflow-x-auto bg-muted/20">
            <code className="text-sm font-mono">{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <p key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {content.slice(lastIndex)}
        </p>
      );
    }

    return parts.length > 0 ? parts : <p className="whitespace-pre-wrap">{content}</p>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      onHoverStart={() => !isUser && setShowActions(true)}
      onHoverEnd={() => !isUser && setShowActions(false)}
    >
      <Avatar className="h-8 w-8 border-2 border-primary/20">
        <AvatarFallback className={isUser ? 'bg-primary/20' : 'bg-secondary/20'}>
          {isUser ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-secondary" />}
        </AvatarFallback>
      </Avatar>

      <div className={`flex-1 max-w-[80%] ${isUser ? 'flex justify-end' : ''}`}>
        <div
          className={`rounded-lg px-4 py-3 ${
            isUser
              ? 'bg-primary text-primary-foreground ml-auto'
              : 'glass'
          }`}
        >
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {renderContent(message.content)}
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
            <Clock className="h-3 w-3" />
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {!isUser && (
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1 mt-2"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-7 px-2"
                      >
                        {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy message</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRegenerate}
                        className="h-7 px-2"
                      >
                        <RotateCw className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Regenerate response</TooltipContent>
                  </Tooltip>

                  <Separator orientation="vertical" className="h-4" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFeedback('up')}
                        className={`h-7 px-2 ${message.feedback === 'up' ? 'text-green-500' : ''}`}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Good response</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFeedback('down')}
                        className={`h-7 px-2 ${message.feedback === 'down' ? 'text-red-500' : ''}`}
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Poor response</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ChatHelpbotPage() {
  // State management
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  const [activeConvId, setActiveConvId] = useState(conversations[0].id);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isWidgetMode, setIsWidgetMode] = useState(false);
  const [isWidgetExpanded, setIsWidgetExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  // Responsive sidebar - hide on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowSidebar(false);
      }
    };

    // Check on initial load
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv.messages, isTyping]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus input
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        textareaRef.current?.focus();
      }

      // Esc to close widget in widget mode
      if (e.key === 'Escape' && isWidgetMode) {
        setIsWidgetExpanded(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWidgetMode]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  // Simulate streaming response with typewriter effect
  const streamResponse = async (text: string, messageId: string) => {
    setIsStreaming(true);
    const words = text.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];

      setConversations(prev => prev.map(conv => {
        if (conv.id !== activeConvId) return conv;
        return {
          ...conv,
          messages: conv.messages.map(msg =>
            msg.id === messageId
              ? { ...msg, content: currentText, isStreaming: i < words.length - 1 }
              : msg
          ),
          updatedAt: new Date()
        };
      }));

      // Variable delay for more natural typing
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 70));
    }

    setIsStreaming(false);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id !== activeConvId) return conv;

      const newMessages = [...conv.messages, userMessage];
      const newTitle = conv.messages.length === 0
        ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
        : conv.title;

      return {
        ...conv,
        title: newTitle,
        messages: newMessages,
        updatedAt: new Date()
      };
    }));

    setInputValue('');
    setIsTyping(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    setIsTyping(false);

    // Add assistant message
    const responseText = getResponseForPrompt(content);
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id !== activeConvId) return conv;
      return {
        ...conv,
        messages: [...conv.messages, assistantMessage],
        updatedAt: new Date()
      };
    }));

    // Stream the response
    await streamResponse(responseText, assistantMessage.id);
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleRegenerate = () => {
    const lastUserMessage = [...activeConv.messages]
      .reverse()
      .find(m => m.role === 'user');

    if (lastUserMessage) {
      // Remove last assistant message
      setConversations(prev => prev.map(conv => {
        if (conv.id !== activeConvId) return conv;
        return {
          ...conv,
          messages: conv.messages.slice(0, -1)
        };
      }));

      // Regenerate response
      setTimeout(() => sendMessage(lastUserMessage.content), 100);
    }
  };

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== activeConvId) return conv;
      return {
        ...conv,
        messages: conv.messages.map(msg =>
          msg.id === messageId
            ? { ...msg, feedback: msg.feedback === type ? undefined : type }
            : msg
        )
      };
    }));
  };

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newConv.id);
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (filtered.length === 0) {
        const newConv: Conversation = {
          id: generateId(),
          title: 'New Conversation',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setActiveConvId(newConv.id);
        return [newConv];
      }
      if (id === activeConvId) {
        setActiveConvId(filtered[0].id);
      }
      return filtered;
    });
  };

  const clearConversation = () => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== activeConvId) return conv;
      return {
        ...conv,
        messages: [],
        title: 'New Conversation',
        updatedAt: new Date()
      };
    }));
  };

  const exportConversation = (format: 'json' | 'md') => {
    const conv = activeConv;

    if (format === 'json') {
      const data = JSON.stringify(conv, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-${conv.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      let markdown = `# ${conv.title}\n\n`;
      markdown += `*Created: ${conv.createdAt.toLocaleString()}*\n\n---\n\n`;

      conv.messages.forEach(msg => {
        const role = msg.role === 'user' ? '👤 User' : '🤖 Assistant';
        markdown += `### ${role}\n\n${msg.content}\n\n---\n\n`;
      });

      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-${conv.id}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Calculate token usage (mock)
  const totalTokens = activeConv.messages.reduce((sum, msg) =>
    sum + Math.ceil(msg.content.length / 4), 0
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  const ChatInterface = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass-dark border-b border-border/40 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            className="shrink-0"
          >
            {showSidebar ? <PanelLeftClose className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shrink-0 hidden sm:flex">
              <Bot className="h-5 w-5 text-primary terminal-glow" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold terminal-glow truncate">{activeConv.title}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Cpu className="h-3 w-3 shrink-0" />
                <span className="truncate">{MODELS.find(m => m.id === settings.model)?.name}</span>
                <span className="opacity-50 hidden sm:inline">•</span>
                <span className="hidden sm:inline">{totalTokens} / {settings.maxTokens} tokens</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => exportConversation('md')}
                  disabled={activeConv.messages.length === 0}
                  className="hidden sm:inline-flex"
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export as Markdown</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => exportConversation('json')}
                  disabled={activeConv.messages.length === 0}
                  className="hidden md:inline-flex"
                >
                  <FileJson className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export as JSON</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearConversation}
                  disabled={activeConv.messages.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear conversation</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          <Button
            variant={showSettings ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>

          {isWidgetMode && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsWidgetExpanded(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsWidgetMode(false)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
            {activeConv.messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6 sm:py-12 space-y-6 sm:space-y-8"
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="inline-flex p-3 sm:p-4 rounded-full glass border-glow">
                    <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-primary terminal-glow" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold terminal-glow">
                    How can I help you today?
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto px-2">
                    Choose a suggested prompt below or ask me anything about coding, debugging, or best practices.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 max-w-2xl mx-auto">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => {
                    const Icon = prompt.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card
                          className="glass hover:border-glow cursor-pointer transition-all group"
                          onClick={() => handleSuggestedPrompt(prompt.text)}
                        >
                          <CardContent className="p-3 sm:p-4 flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <Badge variant="secondary" className="mb-2 text-xs">
                                {prompt.category}
                              </Badge>
                              <p className="text-sm">{prompt.text}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <>
                {activeConv.messages.map(message => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onCopy={() => {}}
                    onRegenerate={handleRegenerate}
                    onFeedback={(type) => handleFeedback(message.id, type)}
                  />
                ))}

                {isTyping && <TypingIndicator />}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="glass-dark border-t border-border/40 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isStreaming ? "Wait for response..." : "Ask me anything..."}
                disabled={isStreaming}
                className="resize-none min-h-[48px] sm:min-h-[52px] max-h-[120px] pr-10 sm:pr-12 glass text-sm sm:text-base"
                rows={1}
              />

              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Attach file (coming soon)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {isStreaming ? (
              <Button
                size="icon"
                variant="destructive"
                className="h-[48px] w-[48px] sm:h-[52px] sm:w-[52px] shrink-0"
                onClick={() => setIsStreaming(false)}
              >
                <StopCircle className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                size="icon"
                className="h-[48px] w-[48px] sm:h-[52px] sm:w-[52px] border-glow shrink-0"
                onClick={handleSend}
                disabled={!inputValue.trim() || isStreaming}
              >
                <Send className="h-5 w-5" />
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2 text-center hidden sm:block">
            Press <kbd className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs">⌘K</kbd> to focus input
          </p>
        </div>
      </div>
    </div>
  );

  const SettingsPanel = (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-80 glass-dark border-l border-border/40 overflow-y-auto"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold terminal-glow flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        {/* Model Selection */}
        <div className="space-y-3">
          <Label>Model</Label>
          <Select
            value={settings.model}
            onValueChange={(value) => setSettings({ ...settings, model: value })}
          >
            <SelectTrigger className="glass">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Temperature */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Temperature</Label>
            <span className="text-sm text-muted-foreground">{settings.temperature.toFixed(1)}</span>
          </div>
          <Slider
            value={[settings.temperature]}
            onValueChange={([value]) => setSettings({ ...settings, temperature: value })}
            min={0}
            max={1}
            step={0.1}
            className="glass"
          />
          <p className="text-xs text-muted-foreground">
            Higher values make output more random, lower values more focused.
          </p>
        </div>

        {/* Max Tokens */}
        <div className="space-y-3">
          <Label>Max Tokens</Label>
          <Input
            type="number"
            value={settings.maxTokens}
            onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) || 2048 })}
            min={256}
            max={8192}
            step={256}
            className="glass"
          />
          <p className="text-xs text-muted-foreground">
            Maximum length of the response (1 token ≈ 4 characters).
          </p>
        </div>

        {/* System Prompt */}
        <Collapsible className="space-y-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <Label>System Prompt</Label>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Textarea
              value={settings.systemPrompt}
              onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
              className="glass min-h-[120px]"
              placeholder="Customize the AI's behavior..."
            />
            <p className="text-xs text-muted-foreground mt-2">
              Define how the AI should respond to your queries.
            </p>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Export Settings */}
        <div className="space-y-3">
          <Label>Export Settings</Label>
          <Button
            variant="outline"
            className="w-full glass justify-start"
            onClick={() => {
              const data = JSON.stringify(settings, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'chat-settings.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download as JSON
          </Button>
        </div>

        <Separator />

        {/* Reset */}
        <Button
          variant="outline"
          className="w-full glass"
          onClick={() => setSettings(DEFAULT_SETTINGS)}
        >
          Reset to Defaults
        </Button>
      </div>
    </motion.div>
  );

  const ConversationsSidebar = (
    <>
      {/* Mobile backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="lg:hidden fixed inset-0 bg-background/60 z-40"
        onClick={() => setShowSidebar(false)}
      />
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        className="w-80 glass-dark border-r border-border/40 flex flex-col fixed lg:relative inset-y-0 left-0 z-50"
      >
      <div className="p-4 border-b border-border/40">
        <Button
          onClick={createNewConversation}
          className="w-full border-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {conversations.map(conv => (
            <Card
              key={conv.id}
              className={`glass cursor-pointer transition-all group ${
                conv.id === activeConvId ? 'border-primary/60 border-glow' : ''
              }`}
              onClick={() => setActiveConvId(conv.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate terminal-glow">
                      {conv.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {conv.messages.length} messages
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conv.updatedAt.toLocaleDateString()}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/40 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Widget Mode</span>
          <Switch
            checked={isWidgetMode}
            onCheckedChange={setIsWidgetMode}
          />
        </div>
      </div>
    </motion.div>
    </>
  );

  // Widget Mode Render
  if (isWidgetMode) {
    return (
      <div className="min-h-screen">
        <SpaceBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 mb-12"
          >
            <Badge variant="secondary" className="mb-2">
              Widget Mode Demo
            </Badge>
            <h1 className="text-4xl md:text-5xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Chat Widget Integration
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Click the chat button in the bottom-right corner to open the chat widget.
              This mode is perfect for integrating the chat into any page.
            </p>

            <Button onClick={() => setIsWidgetMode(false)} variant="outline" className="glass">
              <Maximize2 className="h-4 w-4 mr-2" />
              Switch to Full Page Mode
            </Button>
          </motion.div>

          <Card className="glass max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Sample Content Page</CardTitle>
              <CardDescription>
                This demonstrates how the chat widget works alongside your main content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. The chat widget is accessible from
                any page and maintains conversation history.
              </p>

              <p className="text-muted-foreground">
                You can continue browsing, reading, or working while having the chat available
                at your fingertips. Try it out by clicking the chat button below!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Floating Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {isWidgetExpanded ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-overlay rounded-2xl shadow-2xl border-glow overflow-hidden"
                style={{ width: '420px', height: '600px' }}
              >
                {ChatInterface}
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full border-glow shadow-2xl"
                  onClick={() => setIsWidgetExpanded(true)}
                >
                  <MessageCircle className="h-6 w-6" />
                  {activeConv.messages.length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold"
                    >
                      {activeConv.messages.length}
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Full Page Mode Render
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <SpaceBackground />

      <div className="relative z-10 flex-1 flex overflow-hidden">
        <AnimatePresence>
          {showSidebar && ConversationsSidebar}
        </AnimatePresence>

        <div className="flex-1 flex overflow-hidden min-w-0">
          {ChatInterface}
        </div>

        <AnimatePresence>
          {showSettings && SettingsPanel}
        </AnimatePresence>
      </div>
    </div>
  );
}
