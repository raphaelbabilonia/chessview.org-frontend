import axiosClient, { unwrap } from "./axiosClient";

export const tournamentApi = {
  addSection: (eventId, payload) => axiosClient.post(`/events/${eventId}/sections`, payload).then(unwrap),
  updateSection: (sectionId, payload) => axiosClient.patch(`/sections/${sectionId}`, payload).then(unwrap),
  deleteSection: (sectionId) => axiosClient.delete(`/sections/${sectionId}`).then(unwrap),
  registerForEvent: (eventId, payload) => axiosClient.post(`/events/${eventId}/registrations`, payload).then(unwrap),
  listRegistrations: (eventId) => axiosClient.get(`/events/${eventId}/registrations`).then(unwrap),
  updateRegistrationStatus: (registrationId, status) =>
    axiosClient.patch(`/registrations/${registrationId}/status`, { status }).then(unwrap),
  listPlayers: (eventId, params = {}) => axiosClient.get(`/events/${eventId}/players`, { params }).then(unwrap),
  addPlayer: (eventId, payload) => axiosClient.post(`/events/${eventId}/players`, payload).then(unwrap),
  updatePlayer: (playerId, payload) => axiosClient.patch(`/players/${playerId}`, payload).then(unwrap),
  deletePlayer: (playerId) => axiosClient.delete(`/players/${playerId}`).then(unwrap),
  listRounds: (eventId, params = {}) => axiosClient.get(`/events/${eventId}/rounds`, { params }).then(unwrap),
  addRound: (eventId, payload) => axiosClient.post(`/events/${eventId}/rounds`, payload).then(unwrap),
  updateRound: (roundId, payload) => axiosClient.patch(`/rounds/${roundId}`, payload).then(unwrap),
  listPairings: (roundId) => axiosClient.get(`/rounds/${roundId}/pairings`).then(unwrap),
  addPairing: (roundId, payload) => axiosClient.post(`/rounds/${roundId}/pairings`, payload).then(unwrap),
  updatePairingResult: (pairingId, payload) => axiosClient.patch(`/pairings/${pairingId}/result`, payload).then(unwrap),
  standingsByEvent: (eventId) => axiosClient.get(`/events/${eventId}/standings`).then(unwrap),
  standingsBySection: (sectionId) => axiosClient.get(`/sections/${sectionId}/standings`).then(unwrap)
};
