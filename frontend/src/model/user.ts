import { UserStory } from "./userstory";

export enum VOTING_SYSTEM {
  FIBONACCI = "FIBONACCI",
  TSHIRTS = "TSHIRTS",
}

export interface Participant {
  id: number;
  name: string;
  role: string;
  vote?: string | null;
  status: string;
  connectionId: string;
  roomId: number;
}

export enum PARTICIPANT_ROLE {
  BASE = "BASE",
  OWNER = "OWNER",
}

export enum PARTICIPANT_STATUS {
  ACTIVE = "ACTIVE",
  DISCONNECTED = "DISCONNECTED",
}

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
}

export interface RoomHistory {
  roomId: number;
  roomName: string;
  createdAt: Date;
  votingSystem: VOTING_SYSTEM;
  userStories: UserStory[];
}
