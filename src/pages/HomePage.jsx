import { ArrowRight, CalendarPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventsApi } from "../api/eventsApi";
import BoardPreview from "../components/common/BoardPreview.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import EventCard from "../components/events/EventCard.jsx";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    eventsApi
      .list()
      .then((data) => setEvents(data.slice(0, 3)))
      .catch((err) => setError(err.response?.data?.message || "Unable to load events"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Tournament management for chess clubs</p>
          <h1>Chess View</h1>
          <p>
            Browse public events, register players, manage sections, publish manual pairings,
            enter results, and keep standings visible from the first round to the prize ceremony.
          </p>
          <div className="button-row">
            <Link className="button" to="/events">
              Browse events
              <ArrowRight size={18} />
            </Link>
            <Link className="button button-ghost" to="/register">
              <CalendarPlus size={18} />
              Create account
            </Link>
          </div>
        </div>
        <BoardPreview />
      </section>

      <section className="page-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Public calendar</p>
            <h2>Upcoming and recent events</h2>
          </div>
          <Link className="button button-small button-ghost" to="/events">
            View all
          </Link>
        </div>
        {loading ? <LoadingState label="Loading events" /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!loading && !error ? (
          <div className="event-grid">
            {events.map((event) => (
              <EventCard event={event} key={event._id} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default HomePage;
