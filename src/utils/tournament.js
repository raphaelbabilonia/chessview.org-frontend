export const playerName = (player) => {
  if (!player) return "Not paired";
  return `${player.firstName || ""} ${player.lastName || ""}`.trim();
};

export const byId = (items = []) =>
  items.reduce((map, item) => {
    map[item._id] = item;
    return map;
  }, {});

export const resultLabel = (result) =>
  ({
    pending: "Pending",
    "1-0": "1-0",
    "0-1": "0-1",
    "1/2-1/2": "1/2",
    "bye-white": "White bye",
    "bye-black": "Black bye",
    "forfeit-white": "White forfeits",
    "forfeit-black": "Black forfeits"
  })[result] || result;

export const resultOptions = [
  "pending",
  "1-0",
  "0-1",
  "1/2-1/2",
  "bye-white",
  "bye-black",
  "forfeit-white",
  "forfeit-black"
];
