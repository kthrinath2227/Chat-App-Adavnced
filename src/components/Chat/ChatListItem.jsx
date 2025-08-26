import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const ChatListItem = ({ chat, isSelected, onSelectChat }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: '#f3f4f6' }}
      className={`flex items-center p-4 cursor-pointer border-b border-gray-100 ${
        isSelected ? 'bg-purple-50 border-l-4 border-l-accent-purple' : ''
      }`}
      onClick={() => onSelectChat(chat)}
    >
      <div className="relative">
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {chat.online && <div className="online-indicator" />}
        {chat.isGroup && (
          <div className="absolute -bottom-1 -right-1 bg-gray-600 rounded-full p-1">
            <Users className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
          <span className="text-xs text-gray-500">{chat.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
          {chat.unread > 0 && (
            <span className="primary-purple text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatListItem;
