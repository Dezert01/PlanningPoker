import { UserStory } from "@/model/userstory";
import { api } from "./client";
import { config } from "@/config";

export namespace UserStoryApi {

  export const listUserStories = async (roomId: number) => {
    const result = await api.get<UserStory[]>(`/userStories/${roomId}`);
    return result.data;
  };

  export const getUserStoryDetails = async (userStoryId: number) => {
    const result = await api.get<UserStory>(`/userStories/details/${userStoryId}`);
    return result.data;
  }

  export const exportUserStories = async (roomId: number) => {
    const result = await api.get(`/userStories/export/${roomId}`);
    return result.data;
  }

  export const importUserStories = async (roomId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const requestOptions = {
      method: "POST",
      body: formData
    };

    const result = await fetch(`${config.baseUrl}/api/userStories/import/${roomId}`, requestOptions);

    if (result.ok) {
      return 'Import successful';
    }

    return 'Import failed';
  }
}
