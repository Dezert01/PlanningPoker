"use client";
import Deck from "@/app/room/[roomId]/deck";
import {
  useRoomDetailsQuery,
} from "@/queries/room.queries";
import React, { useEffect, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import Participants from "./participants";
import { TParticipant } from "@/model/room";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UsList from "./userStories/usList";
import { UserStoryTask } from "@/model/userstory";
import { useQueryClient } from "@tanstack/react-query";
import { userStoryKeys } from "@/queries/userstory.queries";
import { config } from "@/config";
import { RoomGameState } from "@/model/room";

export default function Room({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  const queryClient = useQueryClient();
  const roomId = Number(params.roomId);
  let userId = null;
  if (typeof window !== 'undefined') {
    userId = localStorage.getItem('userId');
  }
  const [isCopied, setIsCopied] = useState(false);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [connection, setConnection] = useState(() =>
    new signalR.HubConnectionBuilder()
      .withUrl(`${config.baseUrl}/roomHub`)
      .build(),
  );
  const [gameState, setGameState] = useState<RoomGameState>("GameReady");
  const [participants, setParticipants] = useState<TParticipant[]>([]);
  const [votedTask, setVotedTask] = useState<UserStoryTask | null>(null);
  const [votedTaskEstimation, setVotedTaskEstimation] = useState<string | null>(
    null,
  );
  const [currentChoice, setCurrentChoice] = useState<string | null>(null);

  const router = useRouter();

  const startConnection = useCallback(async () => {
    setVotedTask(null);
    connection.stop().then(() => {
      try {
        connection.on("NoRoomInRoom", async () => {
          router.push("/rooms");
        });
  
        connection.on("VoteInProgress", async () => {
          router.push("/rooms");
        });
  
        connection.on("ParticipantName", async (participantName) => {
          setUserNickname(participantName);
        });
  
        connection.on("GameState", async (gameState) => {
          setGameState(gameState);
        });
  
        connection.on("VotingState", async (votingState: TParticipant[]) => {
          setParticipants(votingState);
          const value = votingState.find((el) => el.name === userNickname)?.value;
          if (!value) {
            setCurrentChoice(null);
          }
        });
  
        connection.on("VotingResults", async (votingResults) => {
          console.log(votingResults);
          setParticipants(votingResults);
        });
  
        connection.on("VotingStart", async (task) => {
          setVotedTask(task);
          setVotedTaskEstimation(null);
        });
  
        connection.on("TaskEstimation", async (taskEstimation) => {
          setVotedTaskEstimation(taskEstimation);
          await submitVoteHandle(null);
        });
  
        if (connection.state === signalR.HubConnectionState.Disconnected) {
          connection.start().then(() => {
            connection.invoke(
              "JoinRoom",
              roomId,
              !!userId ? Number(userId) : null,
            );
          });  
        }

      } catch (error) {
        console.error("SignalR Connection Error:", error);
      }
    })
  }, []);

  useEffect(() => {
    startConnection();
  }, [startConnection]);


  useEffect(() => {
    return () => {
      if (connection) {
        connection.off("NoRoomInRoom");
        connection.off("VoteInProgress");
        connection.off("GameState");
        connection.off("ParticipantName");

        connection.off("UserJoined");
        connection.off("UserLeft");
        connection.off("VoteSubmitted");
        connection.off("VoteWithdrawn");
        connection.off("EveryoneVoted");
        connection.off("VotingState");
        connection.off("VotingResults");

        connection.off("UserStoryAdded");
        connection.off("CreatingUserStoryFailed");
        connection.off("UserStoryUpdated");
        connection.off("UpdatingUserStoryFailed");
        connection.off("UserStoryDeleted");
        connection.off("DeletingUserStoryFailed");

        connection.off("UserStoryTaskCreated");
        connection.off("CreatingUserStoryTaskFailed");
        connection.off("UserStoryTaskUpdated");
        connection.off("UpdatingUserStoryTaskFailed");
        connection.off("UserStoryTaskDeleted");
        connection.off("DeletingUserStoryTaskFailed");
        connection
          .stop()
          .then(() => console.log("SignalR connection stopped"))
          .catch((error) =>
            console.error("Error stopping SignalR connection:", error),
          );
      }
    };
  }, [connection]);

  const { data, isLoading, isError, error } = useRoomDetailsQuery(roomId);

  const submitVoteHandle = async (value: string | null) => {
    if (!connection) return;
    console.log(value, connection.state);
    console.log(userNickname);
    await connection.invoke(
      "SubmitVote",
      roomId,
      userNickname,
      value,
      votedTask?.id,
    );
  };

  const addUserStoryHandle = async (title: string, description: string) => {
    if (!connection) return;
    await connection
      .invoke("AddUserStory", roomId, title, description)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: userStoryKeys.userStories(roomId),
        });
        console.log("User story added");
      });
  };

  const updateUserStoryHandle = async (
    userStoryId: number,
    title: string,
    description: string,
  ) => {
    if (!connection) return;
    await connection
      .invoke("UpdateUserStory", roomId, userStoryId, title, description)
      .then(() =>
        queryClient.invalidateQueries({
          queryKey: userStoryKeys.userStories(roomId),
        }),
      );
  };

  const deleteUserStoryHandle = async (userStoryId: number) => {
    if (!connection) return;
    await connection.invoke("DeleteUserStory", roomId, userStoryId).then(() =>
      queryClient.invalidateQueries({
        queryKey: userStoryKeys.userStories(roomId),
      }),
    );
  };

  const createUserStoryTaskHandle = async (
    userStoryId: number,
    title: string,
    description: string,
  ) => {
    if (!connection) return;
    console.log("Creating task");
    await connection.invoke(
      "CreateUserStoryTask",
      roomId,
      userStoryId,
      title,
      description,
    ).then((res) => {
      console.log("Task created SUCCESS", res);
    }).catch((error) => {
      console.error("Task creation error", error);
    });
  };

  const updateUserStoryTaskHandle = async (
    userStoryTaskId: number,
    title: string,
    description: string,
  ) => {
    if (!connection) return;
    await connection.invoke(
      "UpdateUserStoryTask",
      roomId,
      userStoryTaskId,
      title,
      description,
    );
  };

  const deleteUserStoryTaskHandle = async (userStoryTaskId: number) => {
    if (!connection) return;
    await connection.invoke("DeleteUserStoryTask", roomId, userStoryTaskId);
  };

  const setVotedTaskHandle = async (task: UserStoryTask) => {
    if (!connection) return;
    console.log(task.id);
    await connection.invoke("SetVotedTask", roomId, task.id);
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (isError) {
    return <h1>Error: {error.message}</h1>;
  }
  if (!data) {
    return <h1>No room</h1>;
  }

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between border-b-2 border-white pb-4">
        <h1 className="mr-4">{`Room ${data.name}`}</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 1500); // Hide message after 1.5 seconds
              });
            }}
          >
            {isCopied ? "Link copied!" : "Invite Participant"}
          </Button>
          <Sheet>
            <SheetTrigger className="">
              <Button>Show User Stories</Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
              <SheetHeader>
                <SheetTitle>User Stories</SheetTitle>
              </SheetHeader>
              <UsList
                roomId={roomId}
                createUserStoryHandle={addUserStoryHandle}
                deleteUserStoryHandle={deleteUserStoryHandle}
                updateUserStoryHandle={updateUserStoryHandle}
                addUserStoryHandle={addUserStoryHandle}
                createUserStoryTaskHandle={createUserStoryTaskHandle}
                deleteUserStoryTaskHandle={deleteUserStoryTaskHandle}
                updateUserStoryTaskHandle={updateUserStoryTaskHandle}
                setVotedTaskHandle={setVotedTaskHandle}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <h2>Participants</h2>
      <Participants participants={participants} />

      <div className="my-8 flex w-full justify-center rounded-2xl border-2 border-white py-20">
        {votedTask && (
          <div className="px-3">
            <h3>
              <span className="mb-2">
                <strong>Task at hand: </strong>
              </span>
            </h3>
            <div className="mb-2">
              <strong>Title:</strong> {votedTask?.title}
            </div>

            <div className="mb-2">
              <strong>Description:</strong> {votedTask?.description}
            </div>

            <span>
              <h2>Task estimation: {votedTaskEstimation}</h2>
            </span>
          </div>
        )}
      </div>

      {votedTask !== null && gameState !== "VoteFinished" && (
        <div>
          <h2>Your deck</h2>
          <Deck
            currentChoice={currentChoice}
            setCurrentChoice={setCurrentChoice}
            votingSystem={data.votingSystem}
            submitVoteHandle={submitVoteHandle}
          />
        </div>
      )}
    </div>
  );
}
