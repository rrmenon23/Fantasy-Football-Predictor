import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end space-x-2">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask about lineups, trades, players..."
        disabled={disabled}
        rows={1}
        className="
          flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          max-h-32
        "
        style={{ minHeight: '42px' }}
      />
      
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="
          p-2 rounded-lg bg-primary-600 text-white
          hover:bg-primary-700 transition-colors
          disabled:bg-gray-300 disabled:cursor-not-allowed
          flex-shrink-0
        "
        aria-label="Send message"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatInput;