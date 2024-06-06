"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store";
import { useEffect, useCallback } from "react";
import { UserApi } from "@/api/user-api";
import { useRouter } from "next/navigation";
import { useUserHistoryQuery } from "@/queries/user.queries";
import { HistoryDialog } from "./hisotryDialog";

export default function Home() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  let userId = null;
  if (typeof window !== 'undefined') {
    userId = localStorage.getItem('userId');
  }
  const { data, isLoading, isError, error } = useUserHistoryQuery();

  const getCurrentUser = useCallback(async () => {
    if (userId) {
      const res = await UserApi.getCurrentUser();
      console.log('res', res);
      setUser(res);
    } else {
      router.push("/login");
    }
  }, [router, setUser, userId]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  if (isLoading || !userId) {
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
        <h1>No user data found</h1>
      </div>
    );
  }

  return (
    <>
      <h1>Scrum Poker for agile Teams</h1>
      <div className="mt-8 flex gap-4 text-white">
        <Link href="/rooms">
          <Button>Active rooms</Button>
        </Link>
        <Link href="/create">
          <Button>Create new room</Button>
        </Link>
      </div>
      <h1 className="mb-4 mt-48 text-center">
        {user?.username} history of the estimation sessions
      </h1>
      <div className="w-full">
        {data.map((room) => (
          <div className="w-full flex-row pb-8" key={room.id}>
            <h2>{room.name}</h2>
            <p className="mb-4 text-lg font-semibold">
              Voting System: {room.votingSystem}
            </p>
            <ul className="flex flex-row flex-wrap gap-8">
              {room.userStories.map((story) => (
                <li
                  key={story.id}
                  className="flex w-full max-w-md flex-col justify-between rounded-lg bg-gray-200 p-4"
                >
                  <div className="mb-8">
                    <h3 className="font-bold text-black">{story.title}</h3>
                    <p className="font-semibold text-black">
                      {story.description}
                    </p>
                    <ul className="mt-4 flex flex-col">
                      {story.tasks.slice(0, 2).map((task) => (
                        <li key={task.id}>
                          <h4 className="text-black">{task.title}</h4>
                          <p className="text-black">{task.description}</p>
                          <p className="font-semibold text-black">
                            Voting result: {task.votingResult}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <HistoryDialog data={story} roomId={room.id} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
