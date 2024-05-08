// types.ts

export interface Lobby {
    name: string;
    players: number;
    maxPlayers: number;
    playerIds: string[]; // Array of player IDs
    messages: Message[]; // Array of messages
}

export interface Message {
    id: string;
    text: string;
}
