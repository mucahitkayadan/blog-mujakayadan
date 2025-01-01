import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { chat_background, notificationSound } from "../assets";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const SharedChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Muja's AI assistant. Feel free to ask me anything about my experience, skills, or projects!" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio(notificationSound));
  const [hasInteracted, setHasInteracted] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && hasInteracted) {
        setShowWelcome(true);
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isOpen, hasInteracted]);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
    };

    document.addEventListener('click', handleInteraction);
    return () => document.removeEventListener('click', handleInteraction);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    try {
        setIsLoading(true);
        const response = await fetch(import.meta.env.VITE_LAMBDA_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: inputMessage,
                threadId: threadId // Send the thread ID if it exists
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setThreadId(data.threadId); // Save the thread ID
        
        // Update messages with history if available
        if (data.history && !threadId) {
            setMessages([
                ...data.history.map((msg: any) => ([
                    { role: 'user', content: msg.userMessage },
                    { role: 'assistant', content: msg.assistantResponse }
                ])).flat(),
                { role: 'user', content: inputMessage },
                { role: 'assistant', content: data.response }
            ]);
        } else {
            setMessages(prev => [...prev, 
                { role: 'user', content: inputMessage },
                { role: 'assistant', content: data.response }
            ]);
        }
        
        setInputMessage('');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowWelcome(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div 
      className="fixed bottom-5 right-5 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Welcome Bubble */}
      {showWelcome && !isOpen && (
        <motion.div 
          className="absolute bottom-28 right-0 bg-white rounded-lg shadow-lg p-4 mb-4 min-w-[280px] max-w-[320px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className="relative">
            <button 
              onClick={() => setShowWelcome(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200"
            >
              ×
            </button>
            <p className="text-base text-gray-800 pr-4">
              Hey there! Muja salutes you. Would you like to talk to Virtual Muja? 👋
            </p>
          </div>
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45 shadow-lg"></div>
        </motion.div>
      )}

      {/* Chat Button */}
      <motion.div 
        onClick={toggleChat}
        className="w-20 h-20 md:w-24 md:h-24 rounded-full cursor-pointer hover:scale-110 transition-all duration-300 items-center justify-center relative chat-button-pulse flex"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img 
          src={chat_background} 
          alt="Chat" 
          className="w-full h-full object-cover rounded-full hover:opacity-90 transition-all duration-300"
        />
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-tertiary rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faComment} className="text-white text-sm" />
        </div>
      </motion.div>

      {/* Chat Window */}
      {isOpen && (
        <motion.div 
          className="fixed inset-0 md:inset-auto md:bottom-24 md:right-5 w-full md:w-96 h-full md:h-[500px] bg-white md:rounded-lg shadow-xl flex flex-col z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {/* Header */}
          <div className="sticky top-0 w-full bg-white p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Chat with Virtual Muja</h3>
            <button
              onClick={toggleChat}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-[#915EFF] text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-3 flex gap-2 items-center">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32"
              rows={1}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSubmit}
              disabled={!inputMessage.trim() || isLoading}
              className={`px-4 py-2 rounded-lg ${
                inputMessage.trim() && !isLoading
                  ? 'bg-tertiary text-white hover:bg-secondary'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-colors duration-300`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Send'
              )}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}; 