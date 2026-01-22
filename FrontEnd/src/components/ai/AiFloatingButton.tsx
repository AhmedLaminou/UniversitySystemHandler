import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface AiFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const AiFloatingButton: React.FC<AiFloatingButtonProps> = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center group overflow-hidden
        ${isOpen ? 'neon-border bg-gradient-to-r from-red-500 to-red-600' : 'neon-border-purple bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 hover:scale-110 animate-neon-pulse'}
      `}
      aria-label="Toggle AI Assistant"
    >
      {/* Pulse Rings */}
      {!isOpen && (
        <>
          <div className="pulse-ring bg-cyan-400/30" />
          <div className="pulse-ring bg-purple-400/20" style={{ animationDelay: '1s' }} />
        </>
      )}
      
      {/* Icon */}
      {isOpen ? (
        <X className="h-8 w-8 text-white transition-transform duration-300 rotate-90" />
      ) : (
        <div className="relative">
          <Sparkles className="h-8 w-8 text-white animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full" style={{ boxShadow: '0 0 10px hsl(var(--neon-green))' }} />
        </div>
      )}
    </button>
  );
};

export default AiFloatingButton;
