import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LobbyList from '@/components/LobbyList';
import LobbyForm from '@/components/LobbyForm';
import {toast} from "sonner";
import Link from 'next/link';
import {Button} from "@/components/ui/button";
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import Image from "next/image";

import MountainIcon from "@/components/MountainIcon"

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
    const [latestVersion, setLatestVersion] = useState<string | null>(null);
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

    useEffect(() => {
        const fetchLatestVersion = async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/Zinedinarnaut/lobby-system/master/version.txt');
                const data = await response.text();
                if (data) {
                    setLatestVersion(data.trim());
                }
            } catch (error) {
                toast.error(`Error fetching latest version: ${error}`);
            }
        };

        fetchLatestVersion();
    }, []);

    const handleCreateLobby = (lobbyData: { name: string, maxPlayers: number }) => {
        if (ws) {
            ws.send(JSON.stringify({ type: 'create_lobby', ...lobbyData }));
        }
    };

    return (
        <>
            <header className="flex h-16 w-full items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <Link className="flex items-center gap-2 text-lg font-semibold" href="/">
                        <MountainIcon className="h-6 w-6"/>
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <nav className="hidden gap-6 text-sm font-medium md:flex">
                        <Link className="hover:underline hover:underline-offset-4" href="/">
                            Home
                        </Link>
                        <Link className="hover:underline hover:underline-offset-4" href="/privacy-policy">
                            Privacy Policy
                        </Link>
                    </nav>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="rounded-full" size="icon" variant="ghost">
                            <Image
                                alt="Avatar"
                                className="rounded-full"
                                height="32"
                                quality={100}
                                src="https://proclad-construction.vercel.app/api/v1/avatar/1"
                                style={{
                                    aspectRatio: "32/32",
                                    objectFit: "cover",
                                }}
                                width="32"
                            />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link href="/pin">PIN</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="#">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/privacy-policy">Privacy Policy</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link href="#">Login in</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
            <main className="flex min-h-screen w-full flex-col items-center justify-center py-12">
                <div className="container mx-auto max-w-5xl px-4 md:px-6">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <LobbyList lobbies={lobbies}/>
                        <LobbyForm onCreate={(lobbyData: {
                            name: string,
                            players: number,
                            maxPlayers: number
                        }) => handleCreateLobby(lobbyData)}/>
                    </div>
                </div>
            </main>
            <footer
                className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Araxyso. All rights reserved.</p>
                <div
                    className="flex p-2 flex-col items-center justify-center space-y-2 text-sm text-muted-foreground">
                    <Button key="1" className="flex items-center space-x-2 bg-transparent" variant="outline">
                        <CircleIcon className="h-4 w-4 animate-pulse text-green-500"/>
                        {latestVersion && (
                            <span>Latest version: {latestVersion}</span>
                        )}
                    </Button>
                </div>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="/privacy-policy">
                        Privacy Policy
                    </Link>
                </nav>
            </footer>
        </>
    );
};

function CircleIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
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
            <circle cx="12" cy="12" r="10"/>
        </svg>
    )
}

export default IndexPage;
