import { config } from "@/config";
import axios, { isAxiosError } from "axios";
// // @ts-ignore
import curlirize from "axios-curlirize";

const APP_TIMEOUT = 9_000;

export const api = axios.create({
  baseURL: "https://backendinf1337.azurewebsites.net/api/", // config.baseUrl
  headers: {
    "Content-Type": "application/json",
  },
  timeout: APP_TIMEOUT,
  withCredentials: true,
});

curlirize(api);
