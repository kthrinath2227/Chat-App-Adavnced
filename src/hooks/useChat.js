
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const useChat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [isTyping, setIsTyping] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchChats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('chats')
      .select(`
        id,
        is_group,
        group_name,
        group_avatar_url,
        chat_participants!inner(
          profiles(id, username, avatar_url, online_status)
        ),
        messages(content, created_at)
      `)
      .eq('chat_participants.user_id', user.id)
      .order('created_at', { foreignTable: 'messages', ascending: false })
      .limit(1, { foreignTable: 'messages' });

    if (error) {
      console.error('Error fetching chats:', error);
    } else {
      const formattedChats = data.map(chat => {
        const otherParticipants = chat.chat_participants.filter(p => p.profiles.id !== user.id);
        const lastMessage = chat.messages[0];
        return {
          id: chat.id,
          name: chat.is_group ? chat.group_name : otherParticipants[0]?.profiles.username || 'Chat',
          avatar: chat.is_group ? chat.group_avatar_url : otherParticipants[0]?.profiles.avatar_url || 'https://images.unsplash.com/photo-1603991414220-51b87b89a371',
          lastMessage: lastMessage?.content || 'No messages yet',
          time: lastMessage ? new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          unread: 0, // Implement unread count logic
          online: !chat.is_group && otherParticipants[0]?.profiles.online_status === 'online',
          isGroup: chat.is_group,
        };
      });
      setChats(formattedChats);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const fetchMessages = useCallback(async (chatId) => {
    if (!chatId) return;
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        status,
        user_id,
        profiles ( username, avatar_url )
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        text: msg.content,
        sent: msg.user_id === user.id,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: msg.status,
      }));
      setMessages(prev => ({ ...prev, [chatId]: formattedMessages }));
    }
  }, [user]);

  const sendMessage = async (chatId, messageText) => {
    if (!messageText.trim() || !chatId || !user) return;

    const { data, error } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, user_id: user.id, content: messageText }])
      .select();

    if (error) {
      console.error('Error sending message:', error);
    }
  };

  const createOrOpenChat = async (otherUserId) => {
    if (!user) return null;

    // Check if a 1-on-1 chat already exists
    const { data: existingChat, error: existingChatError } = await supabase.rpc('get_existing_chat', { user_id_1: user.id, user_id_2: otherUserId });

    if (existingChatError) {
      console.error('Error checking for existing chat:', existingChatError);
      return null;
    }

    if (existingChat) {
      // Chat exists, fetch its details and return
      const { data: chatDetails, error: chatDetailsError } = await supabase
        .from('chats')
        .select(`*, chat_participants(profiles(*))`)
        .eq('id', existingChat)
        .single();
      
      if (chatDetailsError) {
        console.error('Error fetching existing chat details:', chatDetailsError);
        return null;
      }
      
      const otherParticipant = chatDetails.chat_participants.find(p => p.profiles.id !== user.id);
      return {
        id: chatDetails.id,
        name: otherParticipant.profiles.username,
        avatar: otherParticipant.profiles.avatar_url,
        lastMessage: 'Chat already exists',
        time: '',
        unread: 0,
        online: otherParticipant.profiles.online_status === 'online',
        isGroup: false,
      };
    }

    // Create a new chat
    const { data: newChat, error: newChatError } = await supabase
      .from('chats')
      .insert({ is_group: false })
      .select()
      .single();

    if (newChatError) {
      console.error('Error creating new chat:', newChatError);
      return null;
    }

    // Add participants
    const { error: participantsError } = await supabase
      .from('chat_participants')
      .insert([
        { chat_id: newChat.id, user_id: user.id },
        { chat_id: newChat.id, user_id: otherUserId },
      ]);

    if (participantsError) {
      console.error('Error adding participants:', participantsError);
      return null;
    }

    await fetchChats(); // Refresh chat list

    const { data: otherProfile, error: profileError } = await supabase.from('profiles').select('*').eq('id', otherUserId).single();
    if (profileError) {
      console.error('Error fetching other user profile:', profileError);
      return null;
    }

    return {
      id: newChat.id,
      name: otherProfile.username,
      avatar: otherProfile.avatar_url,
      lastMessage: 'New chat created!',
      time: '',
      unread: 0,
      online: otherProfile.online_status === 'online',
      isGroup: false,
    };
  };

  useEffect(() => {
    if (!user) return;

    const handleInserts = (payload) => {
      const newMessage = payload.new;
      // Check if the new message belongs to a chat we are tracking
      if (Object.keys(messages).some(chatId => parseInt(chatId) === newMessage.chat_id)) {
        fetchMessages(newMessage.chat_id);
      }
      // Always refetch chats to update last message/order
      fetchChats();
    };

    const messageSubscription = supabase.channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, handleInserts)
      .subscribe();
      
    const participantSubscription = supabase.channel('public:chat_participants')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_participants' }, (payload) => {
        if (payload.new.user_id === user.id) {
          fetchChats();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
      supabase.removeChannel(participantSubscription);
    };
  }, [user, messages, fetchMessages, fetchChats]);

  return { chats, messages, isTyping, sendMessage, setChats, fetchMessages, loading, createOrOpenChat };
};

export default useChat;
