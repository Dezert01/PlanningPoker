import { UserStoryApi } from "@/api/userstory-api";
import { useQuery } from "@tanstack/react-query";

export const userStoryKeys = {
  userStories: (roomId: number) => ["stories", "list", roomId.toString()],
  userStory: (userStoryId: number) => [
    "story",
    "details",
    userStoryId.toString(),
  ],
  exportUserStories: (roomId: number) => [
    "stories",
    "export",
    roomId.toString(),
  ],
};

export function useListUserStoriesQuery(roomId: number) {
  const query = useQuery({
    queryKey: userStoryKeys.userStories(roomId),
    queryFn: () => UserStoryApi.listUserStories(roomId),
  });
  return query;
}

export function useGetUserStoryDetailsQuery(userStoryId: number) {
  const query = useQuery({
    queryKey: userStoryKeys.userStory(userStoryId),
    queryFn: () => UserStoryApi.getUserStoryDetails(userStoryId),
  });
  return query;
}

export function useExportUserStoriesQuery(roomId: number) {
  const query = useQuery({
    queryKey: userStoryKeys.exportUserStories(roomId),
    queryFn: () => UserStoryApi.exportUserStories(roomId),
  });
  return query;
}
