import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { eventsApi } from "../api/eventsApi";
import { tournamentApi } from "../api/tournamentApi";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import { playerName } from "../utils/tournament.js";

const emptyPlayer = {
  firstName: "",
  lastName: "",
  section: "",
  federation: "ITA",
  club: "",
  rating: "",
  birthYear: "",
  email: ""
};

const PlayersPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState(emptyPlayer);
  const [sectionFilter, setSectionFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvent = () => {
    eventsApi
      .detail(id)
      .then((data) => {
        setEvent(data);
        setForm((current) => ({ ...current, section: current.section || data.sections?.[0]?._id || "" }));
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load players"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  const addPlayer = async (submitEvent) => {
    submitEvent.preventDefault();
    setError("");
    try {
      await tournamentApi.addPlayer(id, {
        ...form,
        rating: Number(form.rating || 0),
        birthYear: form.birthYear ? Number(form.birthYear) : null
      });
      setForm({ ...emptyPlayer, section: form.section });
      loadEvent();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add player");
    }
  };

  if (loading) return <LoadingState label="Loading players" />;

  const players = (event.players || []).filter((player) => !sectionFilter || player.section === sectionFilter);

  return (
    <main className="page">
      <section className="page-header with-action">
        <div>
          <p className="eyebrow">Players</p>
          <h1>{event.title}</h1>
        </div>
        <Link className="button button-ghost" to={`/dashboard/events/${id}`}>
          Back to event
        </Link>
      </section>
      {error ? <ErrorState message={error} /> : null}

      <section className="split-layout">
        <form className="panel form-grid" onSubmit={addPlayer}>
          <h2 className="full-span">Add player</h2>
          <label>
            Section
            <select value={form.section} onChange={(change) => setForm({ ...form, section: change.target.value })} required>
              {event.sections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            First name
            <input value={form.firstName} onChange={(change) => setForm({ ...form, firstName: change.target.value })} required />
          </label>
          <label>
            Last name
            <input value={form.lastName} onChange={(change) => setForm({ ...form, lastName: change.target.value })} required />
          </label>
          <label>
            Federation
            <input value={form.federation} onChange={(change) => setForm({ ...form, federation: change.target.value })} />
          </label>
          <label>
            Club
            <input value={form.club} onChange={(change) => setForm({ ...form, club: change.target.value })} />
          </label>
          <label>
            Rating
            <input type="number" value={form.rating} onChange={(change) => setForm({ ...form, rating: change.target.value })} />
          </label>
          <label>
            Birth year
            <input type="number" value={form.birthYear} onChange={(change) => setForm({ ...form, birthYear: change.target.value })} />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(change) => setForm({ ...form, email: change.target.value })} />
          </label>
          <button className="button full-span" type="submit">
            <Plus size={18} />
            Add player
          </button>
        </form>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{players.length} players</p>
              <h2>Player list</h2>
            </div>
            <select value={sectionFilter} onChange={(change) => setSectionFilter(change.target.value)} aria-label="Filter section">
              <option value="">All sections</option>
              {event.sections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
          {players.length ? (
            <div className="card-list">
              {players.map((player) => (
                <article className="list-card" key={player._id}>
                  <strong>{playerName(player)}</strong>
                  <span>{player.club || "No club"}</span>
                  <span>{player.rating || "Unrated"}</span>
                  <button
                    className="icon-button danger"
                    type="button"
                    aria-label={`Delete ${playerName(player)}`}
                    onClick={async () => {
                      await tournamentApi.deletePlayer(player._id);
                      loadEvent();
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No players in this view" />
          )}
        </section>
      </section>
    </main>
  );
};

export default PlayersPage;
