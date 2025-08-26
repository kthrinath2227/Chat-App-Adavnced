import React from 'react';
import ChatHeader from '@/components/Chat/ChatHeader';
import MessageList from '@/components/Chat/MessageList';
import MessageInput from '@/components/Chat/MessageInput';

const ChatWindow = ({ chat, messages, isTyping, onSendMessage, onBack }) => {
  return (
    <div className="flex flex-col flex-1">
      <ChatHeader chat={chat} onBack={onBack} />
      <MessageList messages={messages} isTyping={isTyping} />
      <MessageInput onSendMessage={(message) => onSendMessage(chat.id, message)} />
    </div>
  );
};

export default ChatWindow;
