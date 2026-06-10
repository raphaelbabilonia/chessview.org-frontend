import axiosClient, { unwrap } from "./axiosClient";

export const eventsApi = {
  list: (params = {}) => axiosClient.get("/events", { params }).then(unwrap),
  detail: (id) => axiosClient.get(`/events/${id}`).then(unwrap),
  create: (payload) => axiosClient.post("/events", payload).then(unwrap),
  update: (id, payload) => axiosClient.patch(`/events/${id}`, payload).then(unwrap),
  remove: (id) => axiosClient.delete(`/events/${id}`).then(unwrap)
};
