import { CalendarSearch, LayoutDashboard, LogOut, Moon, Sun, UserRound } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

const Layout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const canManage = user?.role === "organizer" || user?.role === "admin";

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand-mark">CV</span>
          <span>Chess View</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <NavLink to="/events">
            <CalendarSearch size={18} />
            Events
          </NavLink>
          {canManage ? (
            <NavLink to="/dashboard">
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
          ) : null}
        </nav>
        <div className="header-actions">
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isAuthenticated ? (
            <>
              <Link className="icon-button" to="/profile" aria-label="Profile">
                <UserRound size={18} />
              </Link>
              <button className="icon-button" type="button" onClick={logout} aria-label="Log out">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link className="button button-small button-ghost" to="/login">
                Login
              </Link>
              <Link className="button button-small" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
};

export default Layout;
