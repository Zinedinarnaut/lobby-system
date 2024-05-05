import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LobbyList from '@/components/LobbyList';
import LobbyForm from '@/components/LobbyForm';
import {toast} from "sonner";

interface Lobby {
  name: string;
  players: number;
  maxPlayers: number;
  users: { id: string }[];
}

interface WebSocketMessage {
  type: string;
  lobbies?: Lobby[];
  lobby?: Lobby;
  message?: string;
}

interface WebSocketMessageWithCondition extends WebSocketMessage {
  someCondition?: boolean;
}

const IndexPage: React.FC = () => {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const router = useRouter();

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event: MessageEvent) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      switch (data.type) {
        case 'lobby_list':
          if (data.lobbies) {
            setLobbies(data.lobbies);
          }
          break;
        case 'joined_lobby':
          toast.success(`Joined lobby: ${data.lobby}`);
          if (data.lobby) {
            const newLobby: Lobby = {
              name: data.lobby.name,
              players: data.lobby.players,
              maxPlayers: data.lobby.maxPlayers,
              users: data.lobby.users
            };
            setLobbies(prevLobbies => [...prevLobbies, newLobby]);
            const lobbyId = encodeURIComponent(data.lobby.name); // Assuming lobby ID is stored in data.lobby.id
            router.push(`/lobby/${lobbyId}`);
          }
          break;
        case 'left_lobby':
          toast.warning(`Left lobby: ${data.message}`);
          if (data.lobby) {
            setLobbies(prevLobbies => prevLobbies.filter(lobby => lobby.name !== data.lobby!.name));
          }
          break;
        case 'other_message_type':
          console.log('Received other message:', data);
          if ((data as WebSocketMessageWithCondition).someCondition) {
            console.log('Performed some action');
          } else {
            console.log('Performed another action');
          }
          break;
        default:
          toast.warning(`Unknown message type: ${data.type}`);
      }
    };

    socket.addEventListener('error', (event) => {
      toast.error(`WebSocket error: ${event}`);
    });

    socket.addEventListener('close', () => {
      toast.warning('WebSocket connection closed');
    });

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [router]);

  const handleCreateLobby = (lobbyData: { name: string, maxPlayers: number }) => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'create_lobby', ...lobbyData }));
    }
  };

  return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-12">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <LobbyList lobbies={lobbies} />
            <LobbyForm onCreate={(lobbyData: { name: string, players: number, maxPlayers: number }) => handleCreateLobby(lobbyData)} />
          </div>
        </div>
      </main>
  );
};

export default IndexPage;
