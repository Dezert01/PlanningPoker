import { ScrollArea } from "@/components/ui/scroll-area";
import { useListUserStoriesQuery } from "@/queries/userstory.queries";
import UsCard from "./usCard";
import DropzoneComponent from "../dropzone";
import { Button } from "@/components/ui/button";
import CreateUsDialog from "./createUsDialog";
import { UserStoryTask } from "@/model/userstory";

type Props = {
  roomId: number;
  createUserStoryHandle: (title: string, description: string) => void;
  deleteUserStoryHandle: (id: number) => void;
  updateUserStoryHandle: (
    id: number,
    title: string,
    description: string,
  ) => void;
  addUserStoryHandle: (title: string, description: string) => void;
  createUserStoryTaskHandle: (
    userStoryId: number,
    title: string,
    description: string,
  ) => void;
  deleteUserStoryTaskHandle: (id: number) => void;
  updateUserStoryTaskHandle: (
    id: number,
    title: string,
    description: string,
  ) => void;
  setVotedTaskHandle: (task: UserStoryTask) => void;
};

const UsList: React.FC<Props> = ({
  roomId,
  createUserStoryHandle,
  deleteUserStoryHandle,
  updateUserStoryHandle,
  addUserStoryHandle,
  createUserStoryTaskHandle,
  deleteUserStoryTaskHandle,
  updateUserStoryTaskHandle,
  setVotedTaskHandle,
}) => {
  const { data, isLoading, isError, error } = useListUserStoriesQuery(roomId);

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
    <>
      <CreateUsDialog addUserStoryHandle={addUserStoryHandle} />
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4">
          {data?.map((el) => (
            <UsCard
              roomId={roomId}
              key={el.id}
              data={el}
              deleteUserStoryHandle={deleteUserStoryHandle}
              updateUserStoryHandle={updateUserStoryHandle}
              createUserStoryTaskHandle={createUserStoryTaskHandle}
              deleteUserStoryTaskHandle={deleteUserStoryTaskHandle}
              updateUserStoryTaskHandle={updateUserStoryTaskHandle}
              setVotedTaskHandle={setVotedTaskHandle}
            />
          ))}
        </div>
      </ScrollArea>
      <hr className="border-white/50 " />
      <DropzoneComponent />
    </>
  );
};

export default UsList;
