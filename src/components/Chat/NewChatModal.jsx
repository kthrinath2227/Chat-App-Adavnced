
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import useChat from '@/hooks/useChat';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

const NewChatModal = ({ isOpen, onOpenChange, onChatCreated }) => {
  const { user } = useAuth();
  const { createOrOpenChat } = useChat();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .not('id', 'eq', user.id);

        if (error) {
          console.error('Error fetching users:', error);
          toast({
            variant: "destructive",
            title: "Failed to load users",
            description: error.message,
          });
        } else {
          setUsers(data);
        }
        setLoading(false);
      };
      fetchUsers();
    }
  }, [isOpen, user, toast]);

  const handleUserClick = async (otherUser) => {
    const newChat = await createOrOpenChat(otherUser.id);
    if (newChat) {
      onChatCreated(newChat);
      onOpenChange(false);
    } else {
      toast({
        variant: "destructive",
        title: "Could not start chat",
        description: "There was an error creating or opening the chat.",
      });
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
          <DialogDescription>Select a user to start a conversation.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <input
            type="text"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <p>Loading users...</p>
            ) : (
              filteredUsers.map(u => (
                <div
                  key={u.id}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleUserClick(u)}
                >
                  <img src={u.avatar_url || 'https://images.unsplash.com/photo-1603991414220-51b87b89a371'} alt={u.username} className="w-10 h-10 rounded-full mr-3" />
                  <span className="font-medium">{u.username}</span>
                </div>
              ))
            )}
            {!loading && filteredUsers.length === 0 && (
              <p className="text-center text-gray-500">No users found.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatModal;
