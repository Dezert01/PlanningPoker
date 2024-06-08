import { Participant, VOTING_SYSTEM } from "./user";

export interface Room {
  id: number;
  name: string;
  capacity: number;
  createdAt: Date;
  owner?: Participant | null;
  occupancy: number;
  votingSystem: VOTING_SYSTEM;
  gameState: RoomGameState;
}

export type RoomGameState = 'GameReady' | 'VoteInProgress' | 'VoteFinished';