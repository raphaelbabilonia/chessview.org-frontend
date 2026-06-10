import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eventsApi } from "../api/eventsApi";
import ErrorState from "../components/common/ErrorState.jsx";
import LoadingState from "../components/common/LoadingState.jsx";

const emptyEvent = {
  title: "",
  description: "",
  city: "",
  venueName: "",
  address: "",
  startDate: "",
  endDate: "",
  status: "draft",
  registrationStatus: "closed",
  timeControl: "",
  maxPlayers: "",
  contactEmail: "",
  websiteUrl: "",
  regulationsUrl: "",
  isPublic: false
};

const toInputDate = (value) => (value ? new Date(value).toISOString().slice(0, 16) : "");

const EventEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyEvent);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    eventsApi
      .detail(id)
      .then((event) =>
        setForm({
          ...emptyEvent,
          ...event,
          startDate: toInputDate(event.startDate),
          endDate: toInputDate(event.endDate),
          maxPlayers: event.maxPlayers || ""
        })
      )
      .catch((err) => setError(err.response?.data?.message || "Unable to load event"))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const payload = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : "",
      endDate: form.endDate ? new Date(form.endDate).toISOString() : "",
      maxPlayers: Number(form.maxPlayers || 0)
    };
    try {
      const saved = id ? await eventsApi.update(id, payload) : await eventsApi.create(payload);
      navigate(`/dashboard/events/${saved._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save event");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState label="Loading editor" />;

  return (
    <main className="page narrow-page">
      <section className="page-header">
        <p className="eyebrow">Organizer</p>
        <h1>{id ? "Edit event" : "Create event"}</h1>
      </section>
      <form className="panel form-grid" onSubmit={submit}>
        {error ? <ErrorState message={error} /> : null}
        <label className="full-span">
          Title
          <input value={form.title} onChange={(event) => update("title", event.target.value)} required />
        </label>
        <label className="full-span">
          Description
          <textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows="4" />
        </label>
        <label>
          City
          <input value={form.city} onChange={(event) => update("city", event.target.value)} required />
        </label>
        <label>
          Venue
          <input value={form.venueName} onChange={(event) => update("venueName", event.target.value)} />
        </label>
        <label className="full-span">
          Address
          <input value={form.address} onChange={(event) => update("address", event.target.value)} />
        </label>
        <label>
          Start
          <input
            type="datetime-local"
            value={form.startDate}
            onChange={(event) => update("startDate", event.target.value)}
            required
          />
        </label>
        <label>
          End
          <input
            type="datetime-local"
            value={form.endDate}
            onChange={(event) => update("endDate", event.target.value)}
            required
          />
        </label>
        <label>
          Status
          <select value={form.status} onChange={(event) => update("status", event.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label>
          Registration
          <select value={form.registrationStatus} onChange={(event) => update("registrationStatus", event.target.value)}>
            <option value="closed">Closed</option>
            <option value="open">Open</option>
            <option value="full">Full</option>
          </select>
        </label>
        <label>
          Time control
          <input value={form.timeControl} onChange={(event) => update("timeControl", event.target.value)} />
        </label>
        <label>
          Max players
          <input
            type="number"
            value={form.maxPlayers}
            onChange={(event) => update("maxPlayers", event.target.value)}
          />
        </label>
        <label className="full-span">
          Contact email
          <input
            type="email"
            value={form.contactEmail}
            onChange={(event) => update("contactEmail", event.target.value)}
          />
        </label>
        <label className="checkbox-label full-span">
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(event) => update("isPublic", event.target.checked)}
          />
          Public event
        </label>
        <div className="button-row full-span">
          <button className="button" disabled={submitting} type="submit">
            {submitting ? "Saving..." : "Save event"}
          </button>
          <Link className="button button-ghost" to={id ? `/dashboard/events/${id}` : "/dashboard"}>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
};

export default EventEditorPage;
