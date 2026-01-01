import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { Send, User as UserIcon, MessageSquare } from 'lucide-react';
import API from '../../api';

// Initialize socket outside component to prevent multiple connections
const socket = io('http://localhost:5000');

const ChatInterface = ({ role, initialContact }) => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef();

    // Load contacts
    const [isLoadingContacts, setIsLoadingContacts] = useState(true);

    const loadContacts = async () => {
        setIsLoadingContacts(true);
        try {
            // Priority 1: Fetch Active Conversations (Persistent History)
            let activeConversations = [];
            try {
                const { data } = await API.get('/messages/conversations');
                activeConversations = data.map(c => ({
                    id: c.id,
                    name: c.name,
                    avatar: c.avatar,
                    specialty: c.specialization || (c.role === 'doctor' ? 'Doctor' : 'Patient'),
                    lastMessage: c.lastMessage,
                    time: c.time,
                    unread: c.unread
                }));
            } catch (err) {
                console.error("Failed to load conversations", err);
            }

            // Priority 2: Fetch Directory (Doctors or Appointments) for new chats
            let directory = [];
            try {
                if (role === 'patient') {
                    const { data } = await API.get('/doctor/list');
                    directory = data.map(d => ({
                        id: d._id,
                        name: d.name,
                        avatar: d.image || null,
                        specialty: d.specialization
                    }));
                } else {
                    const { data } = await API.get('/appointments/doctor-appointments');
                    const map = new Map();
                    for (const item of data) {
                        if (!map.has(item.patientId._id)) {
                            map.set(item.patientId._id, true);
                            directory.push({
                                id: item.patientId._id,
                                name: item.patientId.name,
                                avatar: null,
                                specialty: 'Patient'
                            });
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to load directory", err);
            }

            // Merge: Dictionary to prevent duplicates. Conversations overwrite directory (keep history data)
            const contactsMap = new Map();
            directory.forEach(c => contactsMap.set(c.id, c));
            activeConversations.forEach(c => contactsMap.set(c.id, c)); // Overwrite with conv data

            const finalContacts = Array.from(contactsMap.values());
            
            // Handle Initial Contact (Redirect Redundancy Check)
            if (initialContact) {
                const exists = finalContacts.find(c => c.id === initialContact.id);
                if (!exists) {
                    finalContacts.unshift(initialContact); // Add to top if not present
                }
                // We'll select it in useEffect or right here
            }

            setContacts(finalContacts);
        } catch (error) {
            console.error("Failed to load contacts", error);
        } finally {
            setIsLoadingContacts(false);
        }
    };
    
    // Effect to select initial contact once contacts are loaded (or just set it directly)
    useEffect(() => {
        if (initialContact && !selectedContact) {
            // Need to ensure it's in the list first, which loadContacts handles, 
            // but we can also set it directly to be responsive.
            setSelectedContact(initialContact);
        }
    }, [initialContact]);

    // Load Message History when contact selected
    useEffect(() => {
        if (!selectedContact) return;
        
        const fetchHistory = async () => {
            try {
                const { data } = await API.get(`/messages/${selectedContact.id}`);
                // Format: socket uses 'isMine', DB uses sender objects. Need to normalize.
                const formatted = data.map(msg => ({
                    message: msg.message,
                    senderId: msg.sender,
                    senderName: msg.senderName, // Ideally from populate or stored
                    isMine: msg.sender === user.id,
                    time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                // Combine with realtime buffer if needed? 
                // Actually, simplest is just setMessages to history. Realtime will append.
                setMessages(formatted);
            } catch (err) {
                console.error("Failed to load history", err);
            }
        };
        fetchHistory();
    }, [selectedContact, user.id]);

    useEffect(() => {
        if (!user) return;
        
        // ... (socket join logic remains)
        socket.emit("join_room", user.id);
        
         const handleReceiveMessage = (data) => {
             // If message belongs to CURRENT conversation, append
             if (selectedContact && (data.senderId === selectedContact.id || data.to === selectedContact.id)) {
                  setMessages((prev) => [...prev, { ...data, isMine: data.senderId === user.id }]);
             }
             
             // Update Contact List order (bump to top) & Notification
             setContacts(prev => {
                const exists = prev.find(c => c.id === data.senderId);
                const newContact = exists ? { ...exists, lastMessage: data.message } : {
                    id: data.senderId,
                    name: data.senderName || 'New Contact',
                    avatar: null,
                    specialty: 'Patient',
                    lastMessage: data.message
                };
                // Remove existing and unshift new to top
                const others = prev.filter(c => c.id !== data.senderId);
                return [newContact, ...others];
             });

            // Notification Logic ...
            if (data.senderId !== user.id) {
               // ... existing notification logic
               if (!document.hasFocus() || selectedContact?.id !== data.senderId) {
                    const senderName = data.senderName || "Someone";
                    if (Notification.permission === 'granted') {
                        new Notification(`New message from ${senderName}`, { body: data.message });
                    }
                    // ...
               }
            }
        };

        socket.on("receive_message", handleReceiveMessage);
        
        loadContacts();

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [user, selectedContact]); // Logic updated to depend on selectedContact for live append check

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        const msgData = {
            to: selectedContact.id,
            from: user.id,
            senderId: user.id, // redundancy for clarity
            senderName: user.name, // Added Name
            message: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMine: true
        };

        socket.emit("send_message", msgData);
        setMessages((prev) => [...prev, msgData]);
        setNewMessage("");
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Contacts Sidebar */}
            <div className="w-80 border-r bg-gray-50 flex flex-col">
                <div className="p-4 border-b bg-white">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        <MessageSquare className="text-teal-600" />
                        Messages
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {contacts.length === 0 ? (
                        <div className="p-4 text-center text-gray-400 text-sm">No contacts found</div>
                    ) : (
                        contacts.map(contact => (
                            <div 
                                key={contact.id}
                                onClick={() => setSelectedContact(contact)}
                                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-white transition-colors ${selectedContact?.id === contact.id ? 'bg-white border-l-4 border-teal-500 shadow-sm' : ''}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                                    {contact.avatar ? <img src={contact.avatar} className="w-full h-full rounded-full object-cover"/> : contact.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-800 truncate">{contact.name}</h4>
                                    {contact.specialty && <p className="text-xs text-gray-500 truncate">{contact.specialty}</p>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedContact ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b flex items-center gap-3 shadow-sm z-10">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {selectedContact.avatar ? <img src={selectedContact.avatar} className="w-full h-full rounded-full object-cover"/> : <UserIcon size={20} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{selectedContact.name}</h3>
                                <span className="text-xs text-green-500 flex items-center gap-1">● Online</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 mt-10">Start a conversation with {selectedContact.name}</div>
                            )}
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl ${msg.isMine ? 'bg-teal-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                                        <p className="text-sm">{msg.message}</p>
                                        <span className={`text-[10px] block text-right mt-1 ${msg.isMine ? 'text-teal-100' : 'text-gray-400'}`}>{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 border-gray-200 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                                />
                                <button type="submit" className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition shadow-lg disabled:opacity-50" disabled={!newMessage.trim()}>
                                    <Send size={20} className="ml-0.5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare size={48} className="mb-4 text-gray-300" />
                        <p>Select a contact to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInterface;
