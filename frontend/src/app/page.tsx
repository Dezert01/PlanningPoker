"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store";
import { useEffect, useCallback } from "react";
import { UserApi } from "@/api/user-api";
import { useUserHistoryQuery } from "@/queries/user.queries";
import { HistoryDialog } from "./hisotryDialog";

export default function Home() {
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
      setUser(res);
    } 
  }, [setUser, userId]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);


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
        <div className="w-full mt-48">
         {!isLoading && !isError && <h1 className="mb-4 text-center">
           {user?.username} history of the estimation sessions
         </h1>}
         {isLoading ? <h1 className="text-center text-xl text-white/70">{"Loading..."}</h1> : 
         isError ? <h1 className="text-center text-xl text-red">{userId ? `Error: ${error.message}` : "Guest users don't have estimations history"}</h1> :
         (!data) ? <h1 className="text-center text-xl text-white/70">{userId ? "User history is empty" : "Guest users don't have estimations history"}</h1> :
         data.map((userHistory) => (
           <div className="w-full flex-row pb-8" key={userHistory.roomId}>
             <h2>{userHistory.roomName}</h2>
             <p className="mb-4 text-lg font-semibold">
               Voting System: {userHistory.roomVotingSystem}
             </p>
             <ul className="flex flex-row flex-wrap gap-8">
               {userHistory.roomUserStories.map((story) => (
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
                             Voting result: {task.estimationResult}
                           </p>
                         </li>
                       ))}
                     </ul>
                   </div>
                   <HistoryDialog data={story} roomId={userHistory.roomId} />
                 </li>
               ))}
             </ul>
           </div>
         ))}
       </div>
    </>
  );
}
