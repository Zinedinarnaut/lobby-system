import { useRouter } from 'next/router';
import {SVGProps, useEffect, useState} from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Lobby {
    name: string;
    players: number;
    maxPlayers: number;
}

interface Message {
    id: string;
    text: string;
}

const LobbyPage: React.FC = () => {
    const router = useRouter();
    const { lobbyId } = router.query;
    const [lobby, setLobby] = useState<Lobby | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState('');
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [lobbyActive, setLobbyActive] = useState(true); // Track lobby activity

    useEffect(() => {
        let socketInstance: WebSocket;

        const establishConnection = () => {
            socketInstance = new WebSocket('ws://localhost:8080');

            socketInstance.onopen = () => {
                console.log('WebSocket connection established');
                // Send a message to the server to join the lobby
                socketInstance.send(JSON.stringify({ type: 'join_lobby', lobbyName: lobbyId }));
            };

            socketInstance.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'joined_lobby') {
                    setLobby(data.lobby);
                } else if (data.type === 'lobby_update') {
                    setLobby(data.lobby);
                } else if (data.type === 'lobby_messages') {
                    // Received updated lobby messages from the server
                    setMessages(data.messages);
                } else if (data.type === 'lobby_closed') {
                    // Handle lobby closure
                    setLobbyActive(false);
                }
            };

            // Listen for the close event
            socketInstance.onclose = () => {
                // Handle unexpected closure (e.g., host refresh or leave)
                setLobbyActive(true);
            };
        };

        establishConnection();

        // Handle refresh events
        const handleRefresh = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
            setLobbyActive(false);
            socketInstance.onclose = () => {
                // Handle unexpected closure (e.g., host refresh or leave)
                setLobbyActive(true);
            };
        };

        window.addEventListener('beforeunload', handleRefresh);

        return () => {
            if (socketInstance) {
                socketInstance.close();
                console.log('WebSocket connection closed');
            }
            window.removeEventListener('beforeunload', handleRefresh);
        };
    }, [lobbyId]);

    const sendMessage = () => {
        if (messageText.trim() !== '' && socket) {
            // Send the message to the server
            socket.send(JSON.stringify({ type: 'send_message', message: messageText }));
            setMessageText('');
        }
    };

    if (!lobby) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {!lobbyActive && (
                <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
                    <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
                        <div className="space-y-4 text-center">
                            <TriangleAlertIcon className="mx-auto h-8 w-8 text-yellow-500" />
                            <h2 className="text-2xl font-bold">The lobby has been closed</h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                The lobby you were trying to join has been closed.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid min-h-screen w-full grid-cols-1 gap-6 p-4 md:grid-cols-2 md:gap-8 lg:gap-10">
                <div className="flex flex-col rounded border bg-white shadow-sm dark:border-gray-800 dark:bg-[#0e0e0f]">
                    <div className="flex-1 p-6">
                        <div className="grid h-full w-full grid-cols-8 grid-rows-8 gap-1" />
                    </div>
                </div>
                <div className="flex flex-col rounded border bg-white shadow-sm dark:border-gray-800 dark:bg-[#0e0e0f]">
                    <div className="flex-1 p-6">
                        <div className="grid h-full gap-4">
                            <div className="flex-1 overflow-auto rounded-lg border bg-gray-100 p-4 dark:border-gray-800 dark:bg-[#0e0e0f]">
                                <div className="grid gap-4">
                                    {/* Display lobby name and player count */}
                                    <h1 className="text-2xl font-bold">Lobby: {lobby.name}</h1>
                                    <p>Players: {lobby.players}/{lobby.maxPlayers}</p>
                                    <p>Max Players: {lobby.maxPlayers}</p>
                                    {/* Display messages */}
                                    {messages.map(message => (
                                        <div key={message.id} className="bg-gray-200 p-2 rounded">
                                            {message.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Textarea
                                    className="resize-none border border-gray-800"
                                    placeholder="Type your message..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                />
                                <Button onClick={sendMessage}>Send</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LobbyPage;

function TriangleAlertIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    );
}
