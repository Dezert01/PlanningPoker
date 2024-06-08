import { CurrentUser, UserHistory } from "@/model/user";
import { api } from "./client";
import { currentUserHistory, currentUserRes } from "@/api-mock-data/auth-data";

export namespace UserApi {
  export const getCurrentUser = async () => {
    const userId = localStorage.getItem("userId");
    const res = await api.get<CurrentUser>(`user/${userId}`);
    console.log(res);
    // const res = { data: currentUserRes };
    return res.data;
  };

  export const getCurrentUserHistory = async () => {
    const userId = localStorage.getItem("userId");
    console.log('userHistory');
    const res = await api.get<UserHistory[]>(`user/${userId}/history`);
    // const res = { data: currentUserHistory };
    return res.data;
  };
}
