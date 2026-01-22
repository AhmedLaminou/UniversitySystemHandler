import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../lib/api';
import { Send, X, Sparkles, Zap } from 'lucide-react';

interface AiChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AiChatWindow: React.FC<AiChatWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bienvenue! Je suis votre assistant académique IA. Comment puis-je vous aider aujourd'hui? Je peux vérifier vos notes, votre emploi du temps ou répondre à vos questions.",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Assuming user ID 1 for MVP or fetch from auth context if available
      const responseText = await api.ai.chat(userMessage.text, "1");
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, je rencontre des difficultés de connexion au serveur.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-8 w-96 h-[550px] cyber-card-glow backdrop-blur-xl bg-card animate-in fade-in slide-in-from-bottom-10 duration-300 flex flex-col z-50 overflow-hidden">
      {/* Cyber Background Effects */}
      <div className="absolute inset-0 cyber-grid-bg opacity-5 pointer-events-none" />
      <div className="scanline-overlay absolute inset-0 pointer-events-none opacity-30" />
      
      {/* Header with Futuristic Design */}
      <div className="relative bg-gradient-to-r from-purple-600 to-cyan-600 p-4 flex justify-between items-center neon-border-purple">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-white animate-pulse" />
            <div className="absolute inset-0 pulse-ring bg-cyan-400/30" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              Assistant IA Académique
            </h3>
            <p className="text-white/80 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              En ligne
            </p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="hover:bg-white/20 p-2 rounded-lg transition-all duration-200 hover:scale-110 group"
        >
          <X className="h-5 w-5 text-white group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-card/90 relative">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-br-none neon-border-purple shadow-lg'
                  : 'cyber-card backdrop-blur-sm text-foreground rounded-bl-none border-2 border-cyan-500/30'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="cyber-card backdrop-blur-sm p-3 rounded-2xl rounded-bl-none border-2 border-cyan-500/30 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', boxShadow: '0 0 8px hsl(var(--cyber-cyan))' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms', boxShadow: '0 0 8px hsl(var(--cyber-purple))' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms', boxShadow: '0 0 8px hsl(var(--cyber-cyan))' }}></div>
              </div>
              <span className="text-xs text-muted-foreground">Analyse en cours...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card/95 border-t border-border/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Posez votre question..."
            className="flex-1 px-4 py-3 neon-border rounded-xl bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20 text-sm transition-all duration-200"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="neon-border-purple bg-gradient-to-r from-purple-600 to-cyan-600 text-white p-3 rounded-xl hover:from-purple-500 hover:to-cyan-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="h-5 w-5" />
                <Zap className="h-4 w-4 animate-pulse" />
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Propulsé par <span className="neon-text text-xs">IA Avancée</span>
        </p>
      </div>
    </div>
  );
};

export default AiChatWindow;
