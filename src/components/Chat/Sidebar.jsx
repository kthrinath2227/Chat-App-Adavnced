
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Camera, Settings, LogOut, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ChatListItem from '@/components/Chat/ChatListItem';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import NewChatModal from '@/components/Chat/NewChatModal';

const Sidebar = ({ chats, selectedChat, onSelectChat, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleFeatureNotImplemented = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200`}>
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              className="w-10 h-10 rounded-full object-cover"
              alt="User avatar"
              src={user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1603991414220-51b87b89a371"}
            />
            <span className="font-semibold text-gray-800">Chats</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(true)}>
              <MessageSquarePlus className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleFeatureNotImplemented}>
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-5 h-5 text-red-500" />
            </Button>
          </div>
        </div>

        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none outline-none focus:bg-white focus:ring-2 focus:ring-accent-purple"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {loading ? (
            <p className="p-4 text-center text-gray-500">Loading chats...</p>
          ) : (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isSelected={selectedChat?.id === chat.id}
                onSelectChat={onSelectChat}
              />
            ))
          )}
        </div>
      </div>
      <NewChatModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} onChatCreated={onSelectChat} />
    </>
  );
};

export default Sidebar;
