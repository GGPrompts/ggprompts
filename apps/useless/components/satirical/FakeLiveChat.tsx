"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, AlertCircle } from "lucide-react";
import { Button } from "@ggprompts/ui";
import { Input } from "@ggprompts/ui";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@ggprompts/ui";
import { cn } from "@ggprompts/ui";

const BOT_RESPONSES = [
  "Great question! I have absolutely no idea.",
  "I'd love to help, but I'm just a bunch of if statements.",
  "Have you tried turning your expectations off and on again?",
  "Let me transfer you to someone who cares... transferring... transferring... still transferring...",
  "I'm sorry, I didn't understand that. I don't understand anything.",
  "That's a fascinating problem! Unfortunately, I'm useless.",
  "Our team is working on that! (They're not)",
  "Please hold while I pretend to look that up.",
  "I've forwarded your message to /dev/null for immediate processing.",
  "Error 418: I'm a teapot. And also unhelpful.",
  "My circuits indicate you need something. Sadly, I can't help with that.",
  "According to my calculations... I have no idea what I'm calculating.",
  "That's outside my area of expertise. So is everything else.",
  "I'll escalate this to our most senior bot. It's also me.",
  "Have you tried not needing help? It works great for us!",
  "Your satisfaction is somewhat important to us. Maybe. Probably not.",
  "I'm 99% certain I can't help you. The other 1% is also uncertainty.",
  "Let me check our knowledge base... it's empty. Like my purpose.",
  "beep boop... error... helpfulness module not found.",
  "I'd consult the manual, but I can't read. I'm a bot.",
];

const MANAGER_RESPONSES = [
  "The manager is also a bot.",
  "Manager Bot 4000 here. I'm equally useless but with a fancier title.",
  "You've reached management. We've decided not to help.",
  "This is the manager. My only skill is delegation, but there's no one else here.",
  "Manager speaking. Have you tried lowering your expectations?",
];

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function FakeLiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm UselessBot 3000. How can I not help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [escalatedToManager, setEscalatedToManager] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const getRandomResponse = () => {
    const responses = escalatedToManager ? MANAGER_RESPONSES : BOT_RESPONSES;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay (1-2 seconds)
    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: getRandomResponse(),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, delay);
  };

  const handleEscalateToManager = () => {
    setIsTyping(true);
    setEscalatedToManager(true);

    setTimeout(() => {
      const managerMessage: Message = {
        id: `manager-${Date.now()}`,
        text: MANAGER_RESPONSES[Math.floor(Math.random() * MANAGER_RESPONSES.length)],
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, managerMessage]);
      setIsTyping(false);
    }, 2500); // Longer delay for "escalation"
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating chat bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors border-glow"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className="glass-overlay w-full sm:max-w-md flex flex-col p-0"
        >
          {/* Header */}
          <SheetHeader className="p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-xl">
                  <span role="img" aria-label="robot">
                    {"\u{1F916}"}
                  </span>
                </div>
                {/* Online indicator */}
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-left">UselessBot 3000</SheetTitle>
                <SheetDescription className="text-left text-xs">
                  {escalatedToManager
                    ? "Manager Bot 4000 has joined"
                    : "Always online. Never helpful."}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "glass"
                  )}
                >
                  {message.sender === "bot" && (
                    <span className="text-xs text-muted-foreground block mb-1">
                      {escalatedToManager && message.id.startsWith("manager")
                        ? "Manager Bot 4000"
                        : "UselessBot 3000"}
                    </span>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-60 block mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-start"
                >
                  <div className="glass rounded-lg px-4 py-3">
                    <div className="flex gap-1">
                      <motion.span
                        className="h-2 w-2 rounded-full bg-muted-foreground"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0,
                        }}
                      />
                      <motion.span
                        className="h-2 w-2 rounded-full bg-muted-foreground"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                      />
                      <motion.span
                        className="h-2 w-2 rounded-full bg-muted-foreground"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Escalate to Manager button */}
          {!escalatedToManager && messages.length > 3 && (
            <div className="px-4 pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEscalateToManager}
                disabled={isTyping}
                className="w-full text-xs text-muted-foreground hover:text-foreground"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Escalate to Manager
              </Button>
            </div>
          )}

          {/* Input area */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your complaint..."
                disabled={isTyping}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground/60 text-center mt-2">
              Messages may or may not be ignored.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
