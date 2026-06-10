const StatusBadge = ({ value, tone }) => {
  const normalized = String(value || "unknown");
  const badgeTone =
    tone ||
    {
      published: "success",
      open: "success",
      completed: "neutral",
      draft: "warning",
      pending: "warning",
      cancelled: "danger",
      rejected: "danger",
      closed: "neutral",
      full: "danger"
    }[normalized] ||
    "neutral";

  return <span className={`badge badge-${badgeTone}`}>{normalized}</span>;
};

export default StatusBadge;
