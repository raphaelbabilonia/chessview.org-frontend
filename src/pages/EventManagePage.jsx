import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eventsApi } from "../api/eventsApi";
import { tournamentApi } from "../api/tournamentApi";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import { formatDateRange } from "../utils/date.js";

const EventManagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [sectionForm, setSectionForm] = useState({ name: "", roundsCount: 5, timeControl: "", maxPlayers: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvent = () => {
    setError("");
    eventsApi
      .detail(id)
      .then(setEvent)
      .catch((err) => setError(err.response?.data?.message || "Unable to load event"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  const updateEvent = async (payload) => {
    try {
      await eventsApi.update(id, payload);
      loadEvent();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update event");
    }
  };

  const addSection = async (submitEvent) => {
    submitEvent.preventDefault();
    try {
      await tournamentApi.addSection(id, {
        ...sectionForm,
        roundsCount: Number(sectionForm.roundsCount || 0),
        maxPlayers: Number(sectionForm.maxPlayers || 0)
      });
      setSectionForm({ name: "", roundsCount: 5, timeControl: "", maxPlayers: "" });
      loadEvent();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add section");
    }
  };

  const removeEvent = async () => {
    if (!window.confirm("Delete this event and its tournament data?")) return;
    await eventsApi.remove(id);
    navigate("/dashboard");
  };

  if (loading) return <LoadingState label="Loading event" />;
  if (error && !event) return <main className="page"><ErrorState message={error} /></main>;

  return (
    <main className="page">
      <section className="page-header with-action">
        <div>
          <p className="eyebrow">{formatDateRange(event.startDate, event.endDate)}</p>
          <h1>{event.title}</h1>
          <div className="badge-stack horizontal">
            <StatusBadge value={event.status} />
            <StatusBadge value={event.registrationStatus} />
          </div>
        </div>
        <div className="button-row">
          <Link className="button button-ghost" to={`/dashboard/events/${id}/edit`}>
            <Pencil size={18} />
            Edit
          </Link>
          <button className="button button-danger" type="button" onClick={removeEvent}>
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </section>
      {error ? <ErrorState message={error} /> : null}

      <section className="quick-actions">
        <Link className="quick-action" to={`/dashboard/events/${id}/registrations`}>
          Registrations
        </Link>
        <Link className="quick-action" to={`/dashboard/events/${id}/players`}>
          Players
        </Link>
        <Link className="quick-action" to={`/dashboard/events/${id}/rounds`}>
          Rounds and results
        </Link>
        <Link className="quick-action" to={`/events/${id}`}>
          Public page
        </Link>
      </section>

      <section className="split-layout">
        <div className="panel">
          <h2>Publishing</h2>
          <div className="button-row">
            <button
              className="button"
              type="button"
              onClick={() => updateEvent({ status: "published", isPublic: true })}
            >
              Publish
            </button>
            <button
              className="button button-ghost"
              type="button"
              onClick={() => updateEvent({ status: "draft", isPublic: false })}
            >
              Unpublish
            </button>
            <button
              className="button button-ghost"
              type="button"
              onClick={() => updateEvent({ registrationStatus: event.registrationStatus === "open" ? "closed" : "open" })}
            >
              {event.registrationStatus === "open" ? "Close registration" : "Open registration"}
            </button>
          </div>
        </div>
        <form className="panel form-grid" onSubmit={addSection}>
          <h2 className="full-span">Add section</h2>
          <label>
            Name
            <input
              value={sectionForm.name}
              onChange={(change) => setSectionForm({ ...sectionForm, name: change.target.value })}
              required
            />
          </label>
          <label>
            Rounds
            <input
              type="number"
              value={sectionForm.roundsCount}
              onChange={(change) => setSectionForm({ ...sectionForm, roundsCount: change.target.value })}
            />
          </label>
          <label>
            Time control
            <input
              value={sectionForm.timeControl}
              onChange={(change) => setSectionForm({ ...sectionForm, timeControl: change.target.value })}
            />
          </label>
          <label>
            Max players
            <input
              type="number"
              value={sectionForm.maxPlayers}
              onChange={(change) => setSectionForm({ ...sectionForm, maxPlayers: change.target.value })}
            />
          </label>
          <button className="button full-span" type="submit">
            <Plus size={18} />
            Add section
          </button>
        </form>
      </section>

      <section className="page-section">
        <h2>Sections</h2>
        {event.sections?.length ? (
          <div className="card-list">
            {event.sections.map((section) => (
              <article className="list-card" key={section._id}>
                <strong>{section.name}</strong>
                <span>{section.timeControl || event.timeControl || "Time control TBA"}</span>
                <span>{section.roundsCount} rounds</span>
                <button
                  className="button button-small button-ghost"
                  type="button"
                  onClick={async () => {
                    await tournamentApi.deleteSection(section._id);
                    loadEvent();
                  }}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No sections yet">Add at least one section before creating players and rounds.</EmptyState>
        )}
      </section>
    </main>
  );
};

export default EventManagePage;
