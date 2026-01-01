import React, { useEffect, useState } from 'react';
import API from '../api';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications'); // Need to ensure route exists
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
       console.log("No notifications fetched");
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id) => {
    try {
        await API.put(`/notifications/${id}/read`);
        fetchNotifications();
    } catch (err) {}
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-600 hover:text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">Notifications</h3>
            {notifications.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500">No notifications</div>
            ) : (
                <div className="max-h-60 overflow-y-auto">
                    {notifications.map(note => (
                        <div key={note._id} 
                             className={`px-4 py-3 border-b text-sm cursor-pointer hover:bg-gray-50 ${!note.isRead ? 'bg-blue-50' : ''}`}
                             onClick={() => markRead(note._id)}
                        >
                            <p className="text-gray-800">{note.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
