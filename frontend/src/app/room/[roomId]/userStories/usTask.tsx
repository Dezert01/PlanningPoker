import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserStoryTask } from "@/model/userstory";
import { Check, SquarePen, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  data: UserStoryTask;
  isEditing: boolean;
  deleteUserStoryTaskHandle?: (id: number) => void;
  updateUserStoryTaskHandle?: (
    id: number,
    title: string,
    description: string,
  ) => void;
  setVotedTaskHandle?: (task: UserStoryTask) => void;
};

const UsTask: React.FC<Props> = ({
  data,
  isEditing,
  deleteUserStoryTaskHandle,
  updateUserStoryTaskHandle,
  setVotedTaskHandle,
}) => {
  const [isEditingTask, setIsEditingTask] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

  const handleUpdateTask = () => {
    if (titleRef.current && descRef.current) {
      updateUserStoryTaskHandle?.(
        data.id,
        titleRef.current.value,
        descRef.current.value,
      );
    }
    setIsEditingTask(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {isEditingTask && isEditing ? (
          <div>
            <Label className="text-sm text-white">Title</Label>
            <Input
              className="mb-4 mt-2"
              ref={titleRef}
              defaultValue={data.title}
            />
          </div>
        ) : (
          <h5>{data.title}</h5>
        )}
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              size="action"
              onClick={() => setIsEditingTask(!isEditingTask)}
            >
              <SquarePen />
            </Button>
            {isEditingTask && isEditing ? (
              <>
                <Button
                  size="action"
                  variant="destructive"
                  onClick={() =>
                    {
                      if (window.confirm("Are you sure you want to delete this?")) {
                        deleteUserStoryTaskHandle &&
                        deleteUserStoryTaskHandle(data.id)
                      }
                    }
                  }
                >
                  <Trash2 />
                </Button>
                <Button size="action" onClick={handleUpdateTask}>
                  <Check />
                </Button>
              </>
            ) : null}
          </div>
        ) : data.estimationResult ? (
          <p className="font-semibold">Voting result: {data.estimationResult}</p>
        ) : (
          <Button
            size="sm"
            onClick={() => setVotedTaskHandle && setVotedTaskHandle(data)}
          >
            Vote
          </Button>
        )}
      </div>
      <div>
        {isEditingTask && isEditing ? (
          <div>
            <Label className="text-sm text-white">Description</Label>
            <Input
              className="mb-4 mt-2"
              ref={descRef}
              defaultValue={data.description}
            />
          </div>
        ) : (
          data.description
        )}
      </div>
    </div>
  );
};

export default UsTask;
