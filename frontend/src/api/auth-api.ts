import { api } from "./client";

export namespace AuthApi {
  export interface SignInReq {
    email: string;
    password: string;
  }

  export interface SignInRes {
    status: boolean;
    message?: string;
    userId: string | null;
  }

  export const signIn = async (data: SignInReq) => {
    const res = await api.post<SignInRes>("/auth/sign-in", data);
    if (res.data.userId) {
      localStorage.setItem("userId", res.data.userId);
    }
    return res.data;
  };

  export interface SignUpReq {
    username: string;
    email: string;
    password: string;
  }

  export interface SignUpRes {
    status: boolean;
    message?: string;
    userId: string | null;
  }

  export const signUp = async (data: SignUpReq) => {
    const res = await api.post<SignUpRes>("/auth/sign-up", data);
    if (res.data.userId) {
      localStorage.setItem("userId", res.data.userId);
    }
    return res.data;
  };
}
