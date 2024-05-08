// MessageDisplay.tsx

import React from 'react';
import { Message } from '@/lib/types'; // Import Message interface if needed

interface Props {
    messages: Message[];
}

const MessageDisplay: React.FC<Props> = ({ messages }) => {
    return (
        <div className="grid gap-4">
            {messages.map(message => (
                <div key={message.id} className="bg-gray-200 p-2 rounded">
                    {message.text}
                </div>
            ))}
        </div>
    );
};

export default MessageDisplay;
