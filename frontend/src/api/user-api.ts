import { CurrentUser, UserHistory } from "@/model/user";
import { api } from "./client";

export namespace UserApi {
  export const getCurrentUser = async () => {
    const userId = localStorage.getItem("userId");
    const res = await api.get<CurrentUser>(`user/${userId}`);
    console.log(res);
    return res.data;
  };

  export const getCurrentUserHistory = async () => {
    const userId = localStorage.getItem("userId");
    const res = await api.get<UserHistory[]>(`user/${userId}/history`);
    return res.data;
  };
}
