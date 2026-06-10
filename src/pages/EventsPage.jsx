import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { eventsApi } from "../api/eventsApi";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import EventCard from "../components/events/EventCard.jsx";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ search: "", city: "", status: "", from: "", to: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = () => {
    setLoading(true);
    setError("");
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    eventsApi
      .list(params)
      .then(setEvents)
      .catch((err) => setError(err.response?.data?.message || "Unable to load events"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const updateFilter = (field, value) => setFilters((current) => ({ ...current, [field]: value }));

  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">Events</p>
        <h1>Find a chess tournament</h1>
      </section>

      <form
        className="filter-bar"
        onSubmit={(event) => {
          event.preventDefault();
          loadEvents();
        }}
      >
        <label>
          Search
          <input
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Open, rapid, junior..."
          />
        </label>
        <label>
          City
          <input value={filters.city} onChange={(event) => updateFilter("city", event.target.value)} />
        </label>
        <label>
          Status
          <select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
            <option value="">Any</option>
            <option value="published">Published</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label>
          From
          <input type="date" value={filters.from} onChange={(event) => updateFilter("from", event.target.value)} />
        </label>
        <label>
          To
          <input type="date" value={filters.to} onChange={(event) => updateFilter("to", event.target.value)} />
        </label>
        <button className="button" type="submit">
          <Search size={18} />
          Apply
        </button>
      </form>

      {loading ? <LoadingState label="Loading events" /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && events.length === 0 ? <EmptyState title="No events match those filters" /> : null}
      {!loading && !error && events.length ? (
        <div className="event-grid">
          {events.map((event) => (
            <EventCard event={event} key={event._id} />
          ))}
        </div>
      ) : null}
    </main>
  );
};

export default EventsPage;
