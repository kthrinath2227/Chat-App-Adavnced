import React from 'react';
import { MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ChatHeader = ({ chat, onBack }) => {
  const handleFeatureNotImplemented = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-transparent border-b border-black-200">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="relative">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {chat.online && <div className="online-indicator" />}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{chat.name}</h3>
          <p className="text-sm text-gray-500">
            {chat.online ? 'Online' : 'Last seen recently'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleFeatureNotImplemented}>
          <Video className="w-5 h-5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleFeatureNotImplemented}>
          <Phone className="w-5 h-5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleFeatureNotImplemented}>
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
