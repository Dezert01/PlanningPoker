import React from "react";
import { Room } from "@/model/room";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";

interface RoomCardProps {
  room: Room;
}

export const RoomCard = ({ room }: RoomCardProps) => {
  const router = useRouter();

  const onJoinButtonPress = () => {
    
    router.push(`/room/${room.id}`);
  };

  return (
    <div
      key={room.id}
      className="flex min-w-60 flex-col rounded-lg bg-gray-200 p-4"
    >
      <div className="flex flex-row gap-2 border-b mb-2 border-black">
        <h2 className="text-lg font-bold text-black ">{room.name} {room.id}</h2>
        <h2 className="text-lg font-bold italic text-black/40">
          {room.votingSystem}
        </h2>
      </div>
    
      
      <p className="mb-8 text-sm font-semibold text-black">
        Current players: {room.occupancy}/{room.capacity}
      </p>
      <Button
        className="ml-auto items-end justify-end self-end"
        onClick={onJoinButtonPress}
        disabled={room.occupancy >= room.capacity || room.gameState === 'VoteInProgress'}
      >
        Join room
      </Button>
    </div>
  );
};
