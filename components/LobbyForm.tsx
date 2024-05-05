import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
    onCreate: (lobbyData: { name: string; players: number; maxPlayers: number }) => void;
}

const LobbyForm: React.FC<Props> = ({ onCreate }) => {
    const [name, setName] = useState('');
    const [players, setPlayers] = useState(2);
    const [maxPlayers, setMaxPlayers] = useState(4); // Set a default maxPlayers value

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onCreate({ name, players, maxPlayers });
        setName('');
        setPlayers(0); // Reset players to default after submitting
    };

    return (
        <div className="rounded bg-white p-6 shadow-md dark:bg-[#0e0e0f]">
            <h2 className="mb-4 text-2xl font-bold">Create a Lobby</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="lobbyName">Lobby Name</Label>
                    <Input id="lobbyName" placeholder="Enter lobby name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="maxUsers">Max Users</Label>
                    <Input id="maxUsers" placeholder="Enter max users" type="number" value={players} onChange={(e) => setPlayers(parseInt(e.target.value))} />
                </div>
                <div>
                    <Label htmlFor="maxPlayers">Max Players</Label>
                    <Input id="maxPlayers" placeholder="Enter max players" type="number" value={maxPlayers} onChange={(e) => setMaxPlayers(parseInt(e.target.value))} />
                </div>
                <Button className="w-full" type="submit">Create Lobby</Button>
            </form>
        </div>
    );
};

export default LobbyForm;
