import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { UserStory, UserStoryTask } from "@/model/userstory";

import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import UsTask from "./usTask";
import { useQueryClient } from "@tanstack/react-query";
import { userStoryKeys } from "@/queries/userstory.queries";

type Props = {
  data: UserStory;
  roomId: number;
  deleteUserStoryHandle: (id: number) => void;
  updateUserStoryHandle: (
    id: number,
    title: string,
    description: string,
  ) => void;
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

const UsCardDialog: React.FC<Props> = ({
  data,
  roomId,
  deleteUserStoryHandle,
  updateUserStoryHandle,
  createUserStoryTaskHandle,
  deleteUserStoryTaskHandle,
  updateUserStoryTaskHandle,
  setVotedTaskHandle,
}) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showAddTask, setShowAddTask] = useState<boolean>(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const taskTitleRef = useRef<HTMLInputElement>(null);
  const taskDescRef = useRef<HTMLInputElement>(null);

  const handleShowAddTask = () => {
    setShowAddTask(!showAddTask);
  };

  const handleAddTask = () => {
    if (taskTitleRef.current && taskDescRef.current) {
      createUserStoryTaskHandle(
        data.id,
        taskTitleRef.current.value,
        taskDescRef.current.value,
      );
        queryClient.invalidateQueries({
          queryKey: userStoryKeys.userStories(roomId),
        });
    }
  };

  const handleToggle = (status: boolean = true) => {
    setIsEditing(false);
    setIsOpen(status);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (titleRef.current && descRef.current) {
      updateUserStoryHandle(
        data.id,
        titleRef.current.value,
        descRef.current.value,
      );
    }

    queryClient.invalidateQueries({
      queryKey: userStoryKeys.userStories(roomId),
    }),
      setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger>
        <Button onClick={() => handleToggle(true)} size="sm">
          Show Details
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background text-white">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? (
              <>
                <Label className="text-sm text-white">Title</Label>
                <Input
                  className="mb-4 mt-2"
                  ref={titleRef}
                  defaultValue={data.title}
                />
              </>
            ) : (
              data.title
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? (
              <>
                <Label className="text-sm text-white">Description</Label>
                <Input
                  className="mt-2"
                  defaultValue={data.description}
                  ref={descRef}
                />
              </>
            ) : (
              data.description
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <h4>Tasks:</h4>
          {isEditing ? (
            <Button size="action" onClick={handleShowAddTask}>
              {showAddTask ? <ChevronUp /> : <ChevronDown />}
            </Button>
          ) : null}
        </div>
        {showAddTask && isEditing ? (
          <div>
            <Label className="text-sm text-white">Title</Label>
            <Input className="mb-4 mt-2" ref={taskTitleRef} />
            <Label className="text-sm text-white">Description</Label>
            <Input className="mb-4 mt-2" ref={taskDescRef} />
            <Button size="sm" onClick={handleAddTask}>
              Add Task
            </Button>
          </div>
        ) : null}
        {data?.tasks && data?.tasks?.length > 0 ? (
          <div>
            {data.tasks.map((task: UserStoryTask) => (
              <UsTask
                key={task.id}
                data={task}
                isEditing={isEditing}
                deleteUserStoryTaskHandle={deleteUserStoryTaskHandle}
                updateUserStoryTaskHandle={updateUserStoryTaskHandle}
                setVotedTaskHandle={setVotedTaskHandle}
              />
            ))}
          </div>
        ) : (
          "No tasks to display."
        )}

        <DialogFooter>
          {isEditing ? (
            <Button variant="destructive" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this?")) {
                  deleteUserStoryHandle(data.id);
                  setIsOpen(false);
                }
              }}
            >
              Delete
            </Button>
          )}
          {isEditing ? (
            <Button onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsCardDialog;
