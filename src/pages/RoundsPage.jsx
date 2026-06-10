import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { eventsApi } from "../api/eventsApi";
import { tournamentApi } from "../api/tournamentApi";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import { formatDateTime } from "../utils/date.js";
import { byId, playerName, resultLabel, resultOptions } from "../utils/tournament.js";

const RoundsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [roundForm, setRoundForm] = useState({ section: "", number: 1, name: "", status: "draft", startsAt: "" });
  const [pairingForm, setPairingForm] = useState({ round: "", boardNumber: 1, whitePlayer: "", blackPlayer: "", result: "pending" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvent = () => {
    setError("");
    eventsApi
      .detail(id)
      .then((data) => {
        setEvent(data);
        setRoundForm((current) => ({
          ...current,
          section: current.section || data.sections?.[0]?._id || "",
          number: current.number || (data.rounds?.length || 0) + 1
        }));
        setPairingForm((current) => ({
          ...current,
          round: current.round || data.rounds?.[0]?._id || "",
          whitePlayer: current.whitePlayer || data.players?.[0]?._id || "",
          blackPlayer: current.blackPlayer || data.players?.[1]?._id || ""
        }));
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load rounds"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  const playersById = useMemo(() => byId(event?.players || []), [event]);
  const pairingsByRound = useMemo(() => {
    const groups = {};
    (event?.pairings || []).forEach((pairing) => {
      groups[pairing.round] = groups[pairing.round] || [];
      groups[pairing.round].push(pairing);
    });
    return groups;
  }, [event]);

  const playersForPairing = useMemo(() => {
    if (!event || !pairingForm.round) return event?.players || [];
    const round = event.rounds.find((item) => item._id === pairingForm.round);
    return event.players.filter((player) => player.section === round?.section);
  }, [event, pairingForm.round]);

  const addRound = async (submitEvent) => {
    submitEvent.preventDefault();
    try {
      await tournamentApi.addRound(id, {
        ...roundForm,
        number: Number(roundForm.number),
        startsAt: roundForm.startsAt ? new Date(roundForm.startsAt).toISOString() : null
      });
      setRoundForm({ ...roundForm, name: "", number: Number(roundForm.number) + 1 });
      loadEvent();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add round");
    }
  };

  const addPairing = async (submitEvent) => {
    submitEvent.preventDefault();
    try {
      await tournamentApi.addPairing(pairingForm.round, {
        ...pairingForm,
        boardNumber: Number(pairingForm.boardNumber),
        blackPlayer: pairingForm.blackPlayer || null
      });
      setPairingForm({ ...pairingForm, boardNumber: Number(pairingForm.boardNumber) + 1, result: "pending" });
      loadEvent();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add pairing");
    }
  };

  const updateResult = async (pairingId, result) => {
    await tournamentApi.updatePairingResult(pairingId, { result });
    loadEvent();
  };

  if (loading) return <LoadingState label="Loading rounds" />;

  return (
    <main className="page">
      <section className="page-header with-action">
        <div>
          <p className="eyebrow">Rounds and results</p>
          <h1>{event.title}</h1>
        </div>
        <Link className="button button-ghost" to={`/dashboard/events/${id}`}>
          Back to event
        </Link>
      </section>
      {error ? <ErrorState message={error} /> : null}

      <section className="split-layout">
        <form className="panel form-grid" onSubmit={addRound}>
          <h2 className="full-span">Create round</h2>
          <label>
            Section
            <select value={roundForm.section} onChange={(change) => setRoundForm({ ...roundForm, section: change.target.value })}>
              {event.sections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Number
            <input type="number" value={roundForm.number} onChange={(change) => setRoundForm({ ...roundForm, number: change.target.value })} required />
          </label>
          <label>
            Name
            <input value={roundForm.name} onChange={(change) => setRoundForm({ ...roundForm, name: change.target.value })} />
          </label>
          <label>
            Status
            <select value={roundForm.status} onChange={(change) => setRoundForm({ ...roundForm, status: change.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label className="full-span">
            Starts at
            <input type="datetime-local" value={roundForm.startsAt} onChange={(change) => setRoundForm({ ...roundForm, startsAt: change.target.value })} />
          </label>
          <button className="button full-span" type="submit">
            <Plus size={18} />
            Create round
          </button>
        </form>

        <form className="panel form-grid" onSubmit={addPairing}>
          <h2 className="full-span">Add manual pairing</h2>
          <label>
            Round
            <select value={pairingForm.round} onChange={(change) => setPairingForm({ ...pairingForm, round: change.target.value })} required>
              {event.rounds.map((round) => (
                <option key={round._id} value={round._id}>
                  {round.name || `Round ${round.number}`}
                </option>
              ))}
            </select>
          </label>
          <label>
            Board
            <input type="number" value={pairingForm.boardNumber} onChange={(change) => setPairingForm({ ...pairingForm, boardNumber: change.target.value })} required />
          </label>
          <label>
            White
            <select value={pairingForm.whitePlayer} onChange={(change) => setPairingForm({ ...pairingForm, whitePlayer: change.target.value })} required>
              {playersForPairing.map((player) => (
                <option key={player._id} value={player._id}>
                  {playerName(player)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Black
            <select value={pairingForm.blackPlayer} onChange={(change) => setPairingForm({ ...pairingForm, blackPlayer: change.target.value })}>
              <option value="">Not paired</option>
              {playersForPairing.map((player) => (
                <option key={player._id} value={player._id}>
                  {playerName(player)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Result
            <select value={pairingForm.result} onChange={(change) => setPairingForm({ ...pairingForm, result: change.target.value })}>
              {resultOptions.map((result) => (
                <option key={result} value={result}>
                  {resultLabel(result)}
                </option>
              ))}
            </select>
          </label>
          <button className="button full-span" type="submit" disabled={!event.rounds.length || !event.players.length}>
            <Plus size={18} />
            Add pairing
          </button>
        </form>
      </section>

      <section className="stack">
        {event.rounds.length ? (
          [...event.rounds]
            .sort((a, b) => a.number - b.number)
            .map((round) => (
              <article className="panel" key={round._id}>
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">{formatDateTime(round.startsAt)}</p>
                    <h2>{round.name || `Round ${round.number}`}</h2>
                  </div>
                  <StatusBadge value={round.status} />
                </div>
                <div className="pairing-grid">
                  {(pairingsByRound[round._id] || []).map((pairing) => (
                    <div className="pairing-card manage" key={pairing._id}>
                      <span className="board-number">Board {pairing.boardNumber}</span>
                      <strong>{playerName(playersById[pairing.whitePlayer])}</strong>
                      <span>vs</span>
                      <strong>{playerName(playersById[pairing.blackPlayer])}</strong>
                      <select value={pairing.result} onChange={(change) => updateResult(pairing._id, change.target.value)}>
                        {resultOptions.map((result) => (
                          <option key={result} value={result}>
                            {resultLabel(result)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </article>
            ))
        ) : (
          <EmptyState title="No rounds yet">Create a round before adding manual pairings.</EmptyState>
        )}
      </section>
    </main>
  );
};

export default RoundsPage;
