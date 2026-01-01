import React from 'react';
import { Search, MoreHorizontal, Check, CheckCheck } from 'lucide-react';

const MessagesWidget = () => {
    // Mock data matching the design
    const messages = [
        {
            id: 1,
            name: "Pedramine G.",
            message: "Eion Morgan is a dedicated pediatrician with over 15 years..",
            time: "Monday",
            avatar: "https://randomuser.me/api/portraits/men/76.jpg",
            unread: true,
            status: "read"
        },
        {
            id: 2,
            name: "Kimberly J.",
            message: "Eion Morgan is a dedicated pediatrician with over 15 years..",
            time: "Saturday",
            avatar: "https://randomuser.me/api/portraits/women/42.jpg",
            unread: true,
            status: "read"
        },
        {
            id: 3,
            name: "Stefan Persson",
            message: "You: Eion Morgan is a dedicated pediatrician with...",
            time: "02, Oct",
            avatar: "https://randomuser.me/api/portraits/men/86.jpg",
            unread: false,
            status: "read"
        }
    ];

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
                        <Search size={20} />
                    </button>
                    <button className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Message List */}
            <div className="space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-4 items-center group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                        <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                <img src={msg.avatar} alt={msg.name} className="w-full h-full object-cover" />
                            </div>
                            {/* Online Status (Optional) */}
                            {msg.unread && (
                                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className={`text-base truncate font-bold ${msg.unread ? 'text-gray-900' : 'text-gray-900'}`}>{msg.name}</h4>
                                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{msg.time}</span>
                            </div>
                            <p className={`text-sm truncate ${msg.unread ? 'text-gray-600 font-medium' : 'text-gray-500'}`}>
                                {msg.message}
                            </p>
                        </div>

                        {/* Status Indicator */}
                        <div className="shrink-0">
                            {msg.unread ? (
                                <div className="w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                    <CheckCheck size={12} />
                                </div>
                            ) : (
                                <CheckCheck size={16} className="text-gray-300" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <button className="w-full mt-6 py-3 text-sm text-teal-600 font-bold bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors">
                View All Messages
            </button>
        </div>
    );
};

export default MessagesWidget;
