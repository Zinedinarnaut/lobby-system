import { useRouter } from 'next/router';
import React, { SVGProps, useEffect, useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarLoader } from "react-spinners";

import MessageDisplay from "@/components/MessageDisplay";

import Board from '@/components/Board'
import Chess from '@/components/chess/Chess';
import MountainIcon from "@/components/MountainIcon";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface Lobby {
    name: string;
    players: number;
    maxPlayers: number;
    playerIds: string[]; // Array of player IDs
    messages: Message[]; // Add messages property
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
    const [latestVersion, setLatestVersion] = useState<string | null>(null);
    const [selectedGame, setSelectedGame] = useState<string>('ticTacToe'); // Default selected game

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

    useEffect(() => {
        const fetchLatestVersion = async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/Zinedinarnaut/lobby-system/master/version.txt');
                const data = await response.text();
                if (data) {
                    setLatestVersion(data.trim());
                }
            } catch (error) {
                console.error('Error fetching latest version:', error);
            }
        };

        fetchLatestVersion();
    }, []);

    if (!lobby) {
        return <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-transparent">
            <BarLoader color="#E3B914" />
        </div>;
    }

    const handleGameChange = (game: string) => {
        setSelectedGame(game);
    };

    return (
        <>
            {!lobbyActive && (
                <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
                    <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
                        <div className="space-y-4 text-center">
                            <TriangleAlertIcon className="mx-auto h-8 w-8 text-yellow-500"/>
                            <h2 className="text-2xl font-bold">The lobby has been closed</h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                The lobby you were trying to join has been closed.
                            </p>
                        </div>
                    </div>
                </div>
            )}
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
                        <DropdownMenuLabel>Signed in as Unkn0wn</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Link href="/pin">Pin</Link>
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
            <div className="grid min-h-screen w-full grid-cols-1 gap-6 p-4 md:grid-cols-2 md:gap-8 lg:gap-10">
                <div className="flex flex-col rounded border bg-white shadow-sm dark:border-gray-800 dark:bg-[#0e0e0f]">
                    <div className="flex-1 p-6">
                        <div className="flex items-center h-full w-full justify-center gap-1">
                            {/* Conditionally render the selected game */}
                            {selectedGame === 'ticTacToe' && <Board/>}
                            {selectedGame === 'chess' && <Chess/>}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col rounded border bg-white shadow-sm dark:border-gray-800 dark:bg-[#0e0e0f]">
                    <div className="flex-1 p-6">
                        <div className="grid h-full gap-4">
                            <div
                                className="flex-1 overflow-auto rounded border bg-gray-100 p-4 dark:border-gray-800 dark:bg-[#0e0e0f]">
                                <div className="grid gap-4">
                                    {/* Display lobby name and player count */}
                                    <h2 className="text-2xl font-bold">Lobby: {lobby.name} {lobby.playerIds}</h2>
                                    <p>Players: {lobby.players}/{lobby.maxPlayers}</p>
                                    <p>Max Players: {lobby.maxPlayers}</p>
                                    {/* Display messages */}
                                    <MessageDisplay messages={messages}/>
                                    <div className="flex h-full w-full gap-4">
                                        <Button onClick={() => handleGameChange('ticTacToe')}>Tic Tac Toe</Button>
                                        <Button onClick={() => handleGameChange('chess')}>Chess</Button>
                                    </div>
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
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
            <path d="M12 9v4"/>
            <path d="M12 17h.01"/>
        </svg>
    );
}

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
