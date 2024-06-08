import { RoomApi } from "@/api/room-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const roomKeys = {
  rooms: () => ["rooms", "list"],
  room: (roomId: number) => ["room", roomId],
};

export function useRoomsListQuery() {
  const query = useQuery({
    queryKey: roomKeys.rooms(),
    queryFn: RoomApi.getRooms,
  });
  return query;
}

export function useRoomDetailsQuery(roomId: number) {
  const query = useQuery({
    queryKey: roomKeys.room(roomId),
    queryFn: () => RoomApi.getRoom(roomId),
  });
  return query;
}

export function useCreateRoomMutation(options: {
  onSuccess: (data: RoomApi.CreateRoomRes) => void;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: RoomApi.createRoom,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.rooms() });
      options.onSuccess(data);
    },
    onError: () => {
      console.log("Error creating room");
    },
  });
  return mutation;
}