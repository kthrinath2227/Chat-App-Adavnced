
import React, { useState, useEffect } from 'react';
import useChat from '@/hooks/useChat';
import Sidebar from '@/components/Chat/Sidebar';
import ChatWindow from '@/components/Chat/ChatWindow';
import WelcomeScreen from '@/components/Chat/WelcomeScreen';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import Auth from '@/components/Auth/Auth';

const ChatLayout = () => {
  const { session, loading: authLoading } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const { chats, messages, isTyping, sendMessage, setChats, fetchMessages, loading: chatLoading } = useChat();

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.id);
    if (chat.unread > 0) {
      setChats(prevChats => prevChats.map(c => 
        c.id === chat.id ? { ...c, unread: 0 } : c
      ));
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-blue-600">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        loading={chatLoading}
      />
      <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
        {selectedChat ? (
          <ChatWindow
            key={selectedChat.id}
            chat={selectedChat}
            messages={messages[selectedChat.id] || []}
            isTyping={isTyping[selectedChat.id]}
            onSendMessage={sendMessage}
            onBack={() => setSelectedChat(null)}
          />
        ) : (
          <WelcomeScreen />
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
