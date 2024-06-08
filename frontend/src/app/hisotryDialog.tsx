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
import UsTask from "./room/[roomId]/userStories/usTask";
import { useQueryClient } from "@tanstack/react-query";
import { userStoryKeys } from "@/queries/userstory.queries";
import { UserHistory } from "@/model/user";

type Props = {
  data: UserStory;
  roomId: number;
};

export const HistoryDialog: React.FC<Props> = ({ data, roomId }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = (status: boolean = true) => {
    setIsOpen(status);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggle}>
      <DialogTrigger>
        <Button onClick={() => handleToggle(true)} className="w-full">
          View All Tasks
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background text-white">
        <DialogHeader>
          <DialogTitle>{data.title}</DialogTitle>
          <DialogDescription>{data.description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <h4>Tasks:</h4>
        </div>
        {data?.tasks && data?.tasks?.length > 0 ? (
          <div>
            {data.tasks.map((task: UserStoryTask) => (
              <UsTask key={task.id} data={task} isEditing={false} />
            ))}
          </div>
        ) : (
          "No tasks to display."
        )}

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
