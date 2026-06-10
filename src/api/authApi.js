import axiosClient, { unwrap } from "./axiosClient";

export const authApi = {
  register: (payload) => axiosClient.post("/auth/register", payload).then(unwrap),
  login: (payload) => axiosClient.post("/auth/login", payload).then(unwrap),
  me: () => axiosClient.get("/auth/me").then(unwrap)
};
