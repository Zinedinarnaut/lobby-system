import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/router';
import {toast} from "sonner";
import {Meteors} from "@/components/magicui/Metors";
import {Boxes} from "@/components/magicui/background-boxes";

interface Lobby {
    name: string;
    players: number;
    maxPlayers: number;
    users: { id: string }[];
}

interface Props {
    lobbies: Lobby[];
}

const LobbyList: React.FC<Props> = ({ lobbies }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [userId, setUserId] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        setWs(socket);

        socket.onopen = () => {
            toast.success('Connected to WebSocket server');
            const id = Math.random().toString(36).substr(2, 9);
            setUserId(id);
        };

        socket.onmessage = (event: MessageEvent) => {
            const data: any = JSON.parse(event.data);
            // Handle messages from the server if needed
            switch (data.type) {
                case 'some_message_type':
                    // Handle the message accordingly
                    break;
                case 'other_message_type':
                    console.log('Received other message:', data);
                    // Handle other types of messages accordingly
                    if (data.someCondition) {
                        // Perform some action
                        console.log('Performed some action');
                    } else {
                        // Perform another action
                        console.log('Performed another action');
                    }
                    break;
                default:
                    // Handle other types of messages if necessary
                    break;
            }
        };

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const handleJoinLobby = (lobbyName: string) => {
        if (ws && userId) {
            if (!lobbies.find(lobby => lobby.users.some(user => user.id === userId))) {
                ws.send(JSON.stringify({ type: 'join_lobby', lobbyName, userId }));
                // Redirect to the lobby page with the lobbyId
                router.push(`/lobby/${lobbyName}`);
            } else {
                toast.warning('You are already in this lobby');
            }
        }
    };

    const handleLeaveLobby = () => {
        if (ws && userId) {
            ws.send(JSON.stringify({ type: 'leave_lobby', userId }));
        }
    };

    return (
        <div className="rounded bg-white p-6 shadow-md dark:bg-[#0e0e0f]">
            <h2 className="mb-4 text-2xl font-bold">Existing Lobbies</h2>
            <div className="space-y-4">
                {lobbies.map((lobby, index) => (
                    <div key={index} className="flex items-center justify-between rounded bg-gray-100 p-4 dark:bg-gray-800">
                        <div>
                            <h3 className="text-lg font-medium">{lobby.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{lobby.players}/{lobby.maxPlayers} users</p>
                        </div>
                        {lobby.users.some(user => user.id === userId) ? (
                            <Button className="h-10 px-4" onClick={handleLeaveLobby}>Leave</Button>
                        ) : (
                            <Button className="h-10 px-4" onClick={() => handleJoinLobby(lobby.name)}>Join</Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LobbyList;
