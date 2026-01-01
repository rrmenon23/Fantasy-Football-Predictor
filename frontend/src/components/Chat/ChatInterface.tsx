import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '@/graphql/mutations';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { Message } from '@/types/chat';
import { Loader2 } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your Fantasy Football AI assistant. Ask me anything about lineups, trades, waiver pickups, or player analysis!",
      timestamp: new Date().toISOString(),
    },
  ]);
  
  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Build conversation history
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send to backend
      const { data } = await sendMessage({
        variables: {
          message: content,
          conversationHistory,
        },
      });

      // Add assistant response
      if (data?.sendMessage) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.sendMessage.message,
          timestamp: data.sendMessage.timestamp,
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">AI Chat Assistant</h2>
        <p className="text-sm text-gray-600 mt-1">
          Ask about lineups, trades, waiver pickups, and player analysis
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {loading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <ChatInput onSend={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};

export default ChatInterface;