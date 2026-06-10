import { Link } from "react-router-dom";
import StatusBadge from "../components/common/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ProfilePage = () => {
  const { logout, user } = useAuth();
  const canManage = user?.role === "organizer" || user?.role === "admin";

  return (
    <main className="page narrow-page">
      <section className="page-header">
        <p className="eyebrow">Profile</p>
        <h1>{user.name}</h1>
      </section>
      <div className="panel">
        <dl className="detail-list">
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>
              <StatusBadge value={user.role} tone="neutral" />
            </dd>
          </div>
        </dl>
        <div className="button-row">
          {canManage ? (
            <Link className="button" to="/dashboard">
              Open dashboard
            </Link>
          ) : null}
          <button className="button button-ghost" type="button" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
