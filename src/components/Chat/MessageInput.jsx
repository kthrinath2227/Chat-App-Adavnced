import React, { useState } from 'react';
import { Paperclip, Smile, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFeatureNotImplemented = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleFeatureNotImplemented}>
          <Paperclip className="w-5 h-5 text-gray-600" />
        </Button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-2 pr-12 bg-white rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-accent-purple"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            onClick={handleFeatureNotImplemented}
          >
            <Smile className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="primary-purple hover:dark-purple text-white"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
