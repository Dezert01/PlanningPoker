// Todo: fill
export interface UserStory {
  id: number;
  title: string;
  description: string;
  tasks: UserStoryTask[];
}

export interface UserStoryTask {
  id: number;
  title: string;
  description: string;
  estimationResult: string;
}
