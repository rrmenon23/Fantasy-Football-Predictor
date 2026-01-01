import { Message } from '@/types/chat';
import { formatTimeAgo } from '@/utils/formatting';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex space-x-2 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div
          className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${isUser ? 'bg-primary-600' : 'bg-gray-200'}
          `}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-gray-600" />
          )}
        </div>

        {/* Message content */}
        <div className="flex flex-col space-y-1">
          <div
            className={`
              rounded-lg px-4 py-2
              ${
                isUser
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }
            `}
          >
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          </div>
          
          <span className={`text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTimeAgo(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;