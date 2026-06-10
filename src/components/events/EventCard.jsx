import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge.jsx";
import { formatDateRange } from "../../utils/date.js";

const EventCard = ({ event, manage = false }) => (
  <article className="event-card">
    <div className="event-card-main">
      <p className="eyebrow">{formatDateRange(event.startDate, event.endDate)}</p>
      <h3>{event.title}</h3>
      <p>{event.description || `${event.city} chess event`}</p>
    </div>
    <div className="event-meta-grid">
      <span>
        <MapPin size={16} />
        {event.city}
      </span>
      <span>
        <CalendarDays size={16} />
        {event.timeControl || "Time control TBA"}
      </span>
      <span>
        <Users size={16} />
        {event.playersCount || 0}/{event.maxPlayers || "∞"}
      </span>
      <span>
        <Trophy size={16} />
        {event.sectionsCount || event.sections?.length || 0} sections
      </span>
    </div>
    <div className="event-card-actions">
      <StatusBadge value={event.status} />
      <StatusBadge value={event.registrationStatus} />
      <Link className="button button-small" to={manage ? `/dashboard/events/${event._id}` : `/events/${event._id}`}>
        {manage ? "Manage" : "Open"}
      </Link>
    </div>
  </article>
);

export default EventCard;
