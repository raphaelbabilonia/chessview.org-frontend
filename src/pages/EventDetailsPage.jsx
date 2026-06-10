import { CalendarDays, MapPin, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { eventsApi } from "../api/eventsApi";
import { tournamentApi } from "../api/tournamentApi";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDateRange, formatDateTime } from "../utils/date.js";
import { byId, playerName, resultLabel } from "../utils/tournament.js";

const tabs = ["Overview", "Players", "Rounds", "Standings"];

const EventDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [registration, setRegistration] = useState({
    firstName: "",
    lastName: "",
    email: "",
    club: "",
    rating: "",
    birthYear: "",
    section: ""
  });

  const loadEvent = () => {
    setLoading(true);
    eventsApi
      .detail(id)
      .then((data) => {
        setEvent(data);
        setRegistration((current) => ({
          ...current,
          email: user?.email || current.email,
          section: data.sections?.[0]?._id || ""
        }));
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load event"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvent();
  }, [id, user?.email]);

  const playerMap = useMemo(() => byId(event?.players || []), [event]);
  const rounds = useMemo(() => [...(event?.rounds || [])].sort((a, b) => a.number - b.number), [event]);
  const pairingsByRound = useMemo(() => {
    const groups = {};
    (event?.pairings || []).forEach((pairing) => {
      groups[pairing.round] = groups[pairing.round] || [];
      groups[pairing.round].push(pairing);
    });
    return groups;
  }, [event]);

  const submitRegistration = async (submitEvent) => {
    submitEvent.preventDefault();
    setMessage("");
    setError("");
    try {
      await tournamentApi.registerForEvent(event._id, {
        ...registration,
        rating: Number(registration.rating || 0),
        birthYear: registration.birthYear ? Number(registration.birthYear) : null
      });
      setMessage("Registration submitted for organizer review.");
      loadEvent();
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  if (loading) return <LoadingState label="Loading event" />;
  if (error && !event) return <main className="page"><ErrorState message={error} /></main>;

  return (
    <main className="page">
      <section className="event-detail-header">
        <div>
          <p className="eyebrow">{formatDateRange(event.startDate, event.endDate)}</p>
          <h1>{event.title}</h1>
          <div className="event-header-meta">
            <span>
              <MapPin size={16} />
              {event.venueName || event.city}
            </span>
            <span>
              <CalendarDays size={16} />
              {event.timeControl || "Time control TBA"}
            </span>
          </div>
        </div>
        <div className="badge-stack">
          <StatusBadge value={event.status} />
          <StatusBadge value={event.registrationStatus} />
        </div>
      </section>

      {error ? <ErrorState message={error} /> : null}
      {message ? <div className="state state-success">{message}</div> : null}

      <div className="tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab ? "tab active" : "tab"}
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" ? (
        <section className="split-layout">
          <div className="panel">
            <h2>Event overview</h2>
            <p>{event.description || "Event details will be published by the organizer."}</p>
            <dl className="detail-list">
              <div>
                <dt>Starts</dt>
                <dd>{formatDateTime(event.startDate)}</dd>
              </div>
              <div>
                <dt>Ends</dt>
                <dd>{formatDateTime(event.endDate)}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{[event.venueName, event.address, event.city].filter(Boolean).join(", ")}</dd>
              </div>
              <div>
                <dt>Organizer</dt>
                <dd>{event.organizer?.name || "Organizer"}</dd>
              </div>
            </dl>
          </div>
          <div className="panel">
            <h2>Sections</h2>
            {event.sections?.length ? (
              <div className="stack">
                {event.sections.map((section) => (
                  <div className="compact-card" key={section._id}>
                    <strong>{section.name}</strong>
                    <span>{section.timeControl || event.timeControl || "Time control TBA"}</span>
                    <span>{section.roundsCount || 0} rounds</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No sections published" />
            )}
          </div>
          <div className="panel">
            <h2>Registration</h2>
            {event.registrationStatus !== "open" ? (
              <EmptyState title="Registrations closed" />
            ) : !isAuthenticated ? (
              <div className="stack">
                <p>Log in to submit a player registration.</p>
                <Link className="button" to="/login">
                  Login
                </Link>
              </div>
            ) : (
              <form className="form-grid" onSubmit={submitRegistration}>
                <label>
                  Section
                  <select
                    value={registration.section}
                    onChange={(change) => setRegistration({ ...registration, section: change.target.value })}
                    required
                  >
                    {event.sections.map((section) => (
                      <option key={section._id} value={section._id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  First name
                  <input
                    value={registration.firstName}
                    onChange={(change) => setRegistration({ ...registration, firstName: change.target.value })}
                    required
                  />
                </label>
                <label>
                  Last name
                  <input
                    value={registration.lastName}
                    onChange={(change) => setRegistration({ ...registration, lastName: change.target.value })}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={registration.email}
                    onChange={(change) => setRegistration({ ...registration, email: change.target.value })}
                    required
                  />
                </label>
                <label>
                  Club
                  <input
                    value={registration.club}
                    onChange={(change) => setRegistration({ ...registration, club: change.target.value })}
                  />
                </label>
                <label>
                  Rating
                  <input
                    type="number"
                    value={registration.rating}
                    onChange={(change) => setRegistration({ ...registration, rating: change.target.value })}
                  />
                </label>
                <button className="button" type="submit">
                  <UserPlus size={18} />
                  Submit registration
                </button>
              </form>
            )}
          </div>
        </section>
      ) : null}

      {activeTab === "Players" ? (
        <section className="card-list">
          {event.players?.length ? (
            event.players.map((player) => (
              <article className="list-card" key={player._id}>
                <strong>{playerName(player)}</strong>
                <span>{player.club || "No club"}</span>
                <span>{player.rating || "Unrated"} rating</span>
              </article>
            ))
          ) : (
            <EmptyState title="No players listed yet" />
          )}
        </section>
      ) : null}

      {activeTab === "Rounds" ? (
        <section className="stack">
          {rounds.length ? (
            rounds.map((round) => (
              <article className="panel" key={round._id}>
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">{round.status}</p>
                    <h2>{round.name || `Round ${round.number}`}</h2>
                  </div>
                  <span>{formatDateTime(round.startsAt)}</span>
                </div>
                <div className="pairing-grid">
                  {(pairingsByRound[round._id] || []).map((pairing) => (
                    <div className="pairing-card" key={pairing._id}>
                      <span className="board-number">Board {pairing.boardNumber}</span>
                      <strong>{playerName(playerMap[pairing.whitePlayer])}</strong>
                      <span>{resultLabel(pairing.result)}</span>
                      <strong>{playerName(playerMap[pairing.blackPlayer])}</strong>
                    </div>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <EmptyState title="No rounds published" />
          )}
        </section>
      ) : null}

      {activeTab === "Standings" ? (
        <section className="card-list">
          {event.standings?.length ? (
            event.standings.map((row) => (
              <article className="standing-card" key={row.playerId}>
                <strong>
                  {row.position}. {playerName(row.player)}
                </strong>
                <span>{row.points} pts</span>
                <span>{row.wins} wins</span>
                <span>{row.scoreString || "No results"}</span>
              </article>
            ))
          ) : (
            <EmptyState title="Standings will appear after results" />
          )}
        </section>
      ) : null}
    </main>
  );
};

export default EventDetailsPage;
