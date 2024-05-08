const WebSocket = require('ws');
const axios = require('axios');

const wss = new WebSocket.Server({ port: 8080 });

const lobbies = [];

const discordWebhookUrl = 'https://discord.com/api/webhooks/1232250462921818142/KawJWWUiV0W4UOeRCVzRGojpC7XTwgODfwnhmYdQr1L5GashdEScjDNwJx4NEEFI-jhw';

// Function to log messages to Discord webhook
function logToDiscord(message, retries = 3) {
    axios.post(discordWebhookUrl, {
        content: message
    }).then(() => {
        console.log('Message logged to Discord webhook');
    }).catch((error) => {
        console.error('Error logging message to Discord webhook:', error);
        if (retries > 0) {
            // Retry logging
            setTimeout(() => {
                logToDiscord(message, retries - 1);
            }, 5000); // Retry after 5 seconds
        } else {
            console.error('Maximum retry limit reached. Unable to log message to Discord webhook.');
        }
    });
}


wss.on('connection', (ws) => {
    const userId = generateUserId(); // Generate a unique user ID for each client connection

    let lobbyName = null; // Track the lobby the client is currently in

    ws.on('message', (message) => {
        const data = JSON.parse(message.toString());
        logToDiscord(`Received message from client: ${JSON.stringify(data)}`);
        switch (data.type) {
            case 'create_lobby':
                // Handle lobby creation
                const newLobby = { name: data.name, players: 0, maxPlayers: data.maxPlayers, users: [{ id: userId }] }; // Track users who join the lobby
                lobbies.push(newLobby);
                // Set the lobby name for the client
                lobbyName = data.name;
                // Broadcast updated lobby list to all clients
                broadcastLobbyList();
                break;
            case 'join_lobby':
                // Handle joining a lobby
                if (!lobbyName && !lobbies.some(lobby => lobby.users.some(user => user.id === userId))) {
                    lobbyName = data.lobbyName;
                    const lobbyIndex = lobbies.findIndex((lobby) => lobby.name === lobbyName);
                    if (lobbyIndex !== -1) {
                        // Lobby found, increment player count
                        lobbies[lobbyIndex].players++;
                        lobbies[lobbyIndex].users.push({ id: userId }); // Add the user's unique ID to the lobby's list of users
                        // Broadcast updated lobby list to all clients
                        broadcastLobbyList();
                        // Send success message to the client
                        ws.send(JSON.stringify({ type: 'joined_lobby', lobby: lobbies[lobbyIndex] }));
                    } else {
                        // Lobby not found, send error message
                        ws.send(JSON.stringify({ type: 'error', message: 'Lobby not found' }));
                    }
                } else {
                    // Client is already in a lobby or has already joined this lobby, send error message
                    ws.send(JSON.stringify({ type: 'error', message: 'Already in a lobby or already joined this lobby' }));
                }
                break;
            case 'leave_lobby':
                // Handle leaving a lobby
                if (lobbyName) {
                    const lobbyIndex = lobbies.findIndex((lobby) => lobby.name === lobbyName);
                    if (lobbyIndex !== -1) {
                        // Lobby found, decrement player count
                        lobbies[lobbyIndex].players--;
                        // Remove the user's unique ID from the lobby's list of users
                        lobbies[lobbyIndex].users = lobbies[lobbyIndex].users.filter(user => user.id !== userId);
                        if (lobbies[lobbyIndex].players <= 0) {
                            // If no more players in the lobby, remove the lobby
                            lobbies.splice(lobbyIndex, 1);
                            logToDiscord(`Lobby ${lobbyName} removed due to no players.`);
                            lobbyName = null; // Reset lobby name for the client
                        }
                        // Broadcast updated lobby list to all clients
                        broadcastLobbyList();
                        // Send success message to the client
                        ws.send(JSON.stringify({ type: 'left_lobby', message: 'Left lobby successfully' }));
                    }
                } else {
                    // Client is not in a lobby, send error message
                    ws.send(JSON.stringify({ type: 'error', message: 'Not in a lobby' }));
                }
                break;
            case 'update_lobby_settings':
                // Handle updating lobby settings
                if (lobbyName) {
                    const lobbyToUpdateIndex = lobbies.findIndex((lobby) => lobby.name === lobbyName);
                    if (lobbyToUpdateIndex !== -1) {
                        // Lobby found, update settings
                        lobbies[lobbyToUpdateIndex] = { ...lobbies[lobbyToUpdateIndex], ...data.settings };
                        // Broadcast updated lobby list to all clients
                        broadcastLobbyList();
                        // Send success message to the client
                        ws.send(JSON.stringify({ type: 'lobby_settings_updated', message: 'Lobby settings updated successfully' }));
                    }
                } else {
                    // Client is not in a lobby, send error message
                    ws.send(JSON.stringify({ type: 'error', message: 'Not in a lobby' }));
                }
                break;
            case 'start_game':
                // Handle starting a game
                if (lobbyName) {
                    const lobbyToStartIndex = lobbies.findIndex((lobby) => lobby.name === lobbyName);
                    if (lobbyToStartIndex !== -1) {
                        // Lobby found, notify all players in the lobby that the game has started
                        wss.clients.forEach((client) => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({ type: 'game_started', message: 'Game started' }));
                            }
                        });
                    }
                } else {
                    // Client is not in a lobby, send error message
                    ws.send(JSON.stringify({ type: 'error', message: 'Not in a lobby' }));
                }
                break;
            case 'other_message_type':
                logToDiscord('Received other message:', data);
                // Handle other types of messages accordingly
                if (data.hasOwnProperty('someCondition')) {
                    // Check if the property exists
                    if (data.someCondition) {
                        // Perform some action
                        ws.send(JSON.stringify({ type: 'some_action', message: 'Performed some action' }));
                    } else {
                        // Perform another action
                        ws.send(JSON.stringify({ type: 'another_action', message: 'Performed another action' }));
                    }
                } else {
                    // Handle if the property does not exist
                    ws.send(JSON.stringify({ type: 'error', message: 'Property someCondition does not exist' }));
                }
                break;
            case 'send_message':
                // Handle sending a message in a lobby
                if (lobbyName) {
                    const lobbyIndex = lobbies.findIndex((lobby) => lobby.name === lobbyName);
                    if (lobbyIndex !== -1) {
                        // Lobby found, add message to lobby's messages array
                        lobbies[lobbyIndex].messages.push({ id: userId, text: data.message });
                        // Broadcast updated lobby message list to all clients in the lobby
                        broadcastLobbyMessages(lobbyName);
                    }
                } else {
                    // Client is not in a lobby, send error message
                    ws.send(JSON.stringify({ type: 'error', message: 'Not in a lobby' }));
                }
                break;
            default:
                // If message type is not recognized, send error message
                ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
        }

    });

    ws.on('close', () => {
        logToDiscord('Client disconnected');
        // Handle client disconnection
        if (lobbyName) {
            const lobbyIndex = lobbies.findIndex((lobby) => lobby.name === lobbyName);
            if (lobbyIndex !== -1) {
                // Lobby found, decrement player count
                lobbies[lobbyIndex].players--;
                // Remove the user's unique ID from the lobby's list of users
                lobbies[lobbyIndex].users = lobbies[lobbyIndex].users.filter(user => user.id !== userId);
                if (lobbies[lobbyIndex].players <= 0) {
                    // If no more players in the lobby, remove the lobby
                    lobbies.splice(lobbyIndex, 1);
                    logToDiscord(`Lobby ${lobbyName} removed due to no players.`);
                }
                // Broadcast updated lobby list to all clients
                broadcastLobbyList();
                lobbyName = null; // Reset lobby name for the client
            }
        }
    });

    // Function to generate a unique user ID
    function generateUserId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // Function to broadcast updated lobby list to all clients
    function broadcastLobbyList() {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'lobby_list', lobbies }));
            }
        });
    }

    // Function to broadcast updated lobby message list to all clients in the lobby
// Function to broadcast updated lobby message list to all clients in the lobby
    function broadcastLobbyMessages(lobbyName) {
        const lobbyIndex = lobbies.findIndex((lobby) => lobby.name === lobbyName);
        if (lobbyIndex !== -1) {
            const lobby = lobbies[lobbyIndex];
            lobby.users.forEach((user) => {
                const client = wss.clients.find((client) => client.userId === user.id);
                if (client && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'lobby_messages', messages: lobby.messages }));
                }
            });
        }
    }
});

console.log('WebSocket server started on port 8080')
logToDiscord('WebSocket server started on port 8080');
