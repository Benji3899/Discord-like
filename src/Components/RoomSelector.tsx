import React from 'react';

interface RoomSelectorProps {
    rooms: string[];
    onSelectRoom: (room: string) => void;
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({ rooms, onSelectRoom }) => {
    return (
        <div>
            <h2>Sélectionnez un salon</h2>
            <ul>
                {rooms.map((room) => (
                    <li key={room} onClick={() => onSelectRoom(room)} style={{ cursor: 'pointer' }}>
                        {room}
                    </li>
                ))}
            </ul>
        </div>
    );
};
