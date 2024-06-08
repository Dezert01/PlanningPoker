"use client";

import { RoomCard } from "@/app/rooms/roomCard";
import { useRoomsListQuery } from "@/queries/room.queries";
import { useEffect } from "react";

export default function Rooms() {
  const { data, isLoading, isError, error, refetch} = useRoomsListQuery();

  useEffect(() => {
    refetch();
  })

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  if (isError) {
    return (
      <div>
        <h1>Error: {error.message}</h1>
      </div>
    );
  }
  if (!data) {
    return (
      <div>
        <h1>No rooms found</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8">Rooms</h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {data.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
