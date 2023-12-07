import { useState, useEffect } from 'react';
import axios from 'axios';

const WebSocketComponent = () => {
    const [socketToken, setSocketToken] = useState(null);
    const [webSocket, setWebSocket] = useState(null);
    const [accessToken, setAccessToken] = useState('accessToken'); // Set your access token here
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);

    console.log("notifications", notifications);

    useEffect(() => {
        const fetchWebSocketToken = async () => {
            try {
                // Replace 'YOUR_BACKEND_BASE_URL' with the actual base URL of your Django backend
                const response = await axios.get('backend url', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const token = response.data.token;

                setSocketToken(token);

                const ws = new WebSocket(`webSocket backend url token=${token}`);

                setWebSocket(ws);

                ws.addEventListener('open', () => {
                    console.log('WebSocket connection opened');
                });

                ws.addEventListener('message', (event) => {
                    console.log('WebSocket message received:', event.data);
                    handleWebSocketMessage(JSON.parse(event.data));
                });

                ws.addEventListener('close', () => {
                    console.log('WebSocket connection closed');
                });

                ws.addEventListener('error', (error) => {
                    console.error('WebSocket error:', error);
                });
            } catch (error) {
                console.error('Error fetching WebSocket token:', error);
            }
        };

        const handleWebSocketMessage = (data) => {
            if (data && data.notifications) {
                console.log("data", data.notifications);
                setNotifications(data.notifications);
            } 
            if (data && data.unread) {
                setUnread(data.unread);
            }
        };

        fetchWebSocketToken();

        // Cleanup function to close WebSocket connection when the component unmounts
        return () => {
            if (webSocket) {
                webSocket.close();
            }
        };
    }, [accessToken]); // Add accessToken to the dependency array if it changes during the component lifecycle

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4">Notifications</h1>
                {
                    unread && <div className="mb-4">
                        <h3 className="text-lg font-semibold">Unread</h3>
                        <p>{unread}</p>
                    </div>
                }
                {
                    notifications && notifications.map((notification, index) => (
                        <div key={index} className="mb-4">
                            <h3 className="text-lg font-semibold">{notification.title}</h3>
                            <p>{notification.message}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default WebSocketComponent;
