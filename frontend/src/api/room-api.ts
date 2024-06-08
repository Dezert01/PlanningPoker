import { VOTING_SYSTEM } from "@/model/user";
import { api } from "./client";
import { Room } from "@/model/room";

export namespace RoomApi {
  export const getRooms = async () => {
    const res = await api.get<Room[]>("/rooms");
    return res.data;
  };

  export const getRoom = async (roomId: number) => {
    const res = await api.get<Room>(`/rooms/${roomId}`);
    return res.data;
  };

  interface CreateRoomReq {
    name: string;
    capacity: number;
    votingSystem: VOTING_SYSTEM;
  }

  export interface CreateRoomRes {
    roomId: number;
  }

  export const createRoom = async (params: CreateRoomReq) => {
    const res = await api.post<CreateRoomRes>("/rooms/create", params);
    return res.data;
  };

  export const getParticipants = async (roomId: number) => {
    const res = await api.get(`/rooms/${roomId}/participants`);
    return res.data;
  };

  export const getVotingState = async (roomId: number) => {
    const res = await api.get(`/rooms/${roomId}/voting-state`);
    return res.data;
  };
}
