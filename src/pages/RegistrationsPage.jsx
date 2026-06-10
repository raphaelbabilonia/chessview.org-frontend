import { Check, MinusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { eventsApi } from "../api/eventsApi";
import { tournamentApi } from "../api/tournamentApi";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";

const RegistrationsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const [eventData, registrationData] = await Promise.all([
        eventsApi.detail(id),
        tournamentApi.listRegistrations(id)
      ]);
      setEvent(eventData);
      setRegistrations(registrationData);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const updateStatus = async (registrationId, status) => {
    await tournamentApi.updateRegistrationStatus(registrationId, status);
    load();
  };

  if (loading) return <LoadingState label="Loading registrations" />;

  return (
    <main className="page">
      <section className="page-header with-action">
        <div>
          <p className="eyebrow">Registrations</p>
          <h1>{event?.title}</h1>
        </div>
        <Link className="button button-ghost" to={`/dashboard/events/${id}`}>
          Back to event
        </Link>
      </section>
      {error ? <ErrorState message={error} /> : null}
      {registrations.length ? (
        <section className="card-list">
          {registrations.map((registration) => (
            <article className="list-card" key={registration._id}>
              <strong>
                {registration.firstName} {registration.lastName}
              </strong>
              <span>{registration.email}</span>
              <span>{registration.club || "No club"}</span>
              <StatusBadge value={registration.status} />
              <div className="button-row compact">
                <button className="icon-button success" type="button" onClick={() => updateStatus(registration._id, "approved")} aria-label="Approve">
                  <Check size={18} />
                </button>
                <button className="icon-button" type="button" onClick={() => updateStatus(registration._id, "cancelled")} aria-label="Cancel">
                  <MinusCircle size={18} />
                </button>
                <button className="icon-button danger" type="button" onClick={() => updateStatus(registration._id, "rejected")} aria-label="Reject">
                  <X size={18} />
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState title="No registrations yet" />
      )}
    </main>
  );
};

export default RegistrationsPage;
