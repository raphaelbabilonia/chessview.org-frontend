import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventsApi } from "../api/eventsApi";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import EventCard from "../components/events/EventCard.jsx";

const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    eventsApi
      .list({ mine: true })
      .then(setEvents)
      .catch((err) => setError(err.response?.data?.message || "Unable to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page">
      <section className="page-header with-action">
        <div>
          <p className="eyebrow">Organizer dashboard</p>
          <h1>Your events</h1>
        </div>
        <Link className="button" to="/dashboard/events/new">
          <Plus size={18} />
          New event
        </Link>
      </section>
      {loading ? <LoadingState label="Loading events" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && events.length === 0 ? (
        <EmptyState title="No organizer events yet">Create an event to start building sections and rounds.</EmptyState>
      ) : null}
      {!loading && !error && events.length ? (
        <div className="event-grid">
          {events.map((event) => (
            <EventCard event={event} key={event._id} manage />
          ))}
        </div>
      ) : null}
    </main>
  );
};

export default DashboardPage;
