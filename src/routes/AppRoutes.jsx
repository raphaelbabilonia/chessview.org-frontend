import { Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import EventDetailsPage from "../pages/EventDetailsPage.jsx";
import EventEditorPage from "../pages/EventEditorPage.jsx";
import EventManagePage from "../pages/EventManagePage.jsx";
import EventsPage from "../pages/EventsPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import PlayersPage from "../pages/PlayersPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import RegistrationsPage from "../pages/RegistrationsPage.jsx";
import RoundsPage from "../pages/RoundsPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="events" element={<EventsPage />} />
      <Route path="events/:id" element={<EventDetailsPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route element={<ProtectedRoute roles={["organizer", "admin"]} />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="dashboard/events/new" element={<EventEditorPage />} />
        <Route path="dashboard/events/:id" element={<EventManagePage />} />
        <Route path="dashboard/events/:id/edit" element={<EventEditorPage />} />
        <Route path="dashboard/events/:id/players" element={<PlayersPage />} />
        <Route path="dashboard/events/:id/rounds" element={<RoundsPage />} />
        <Route path="dashboard/events/:id/registrations" element={<RegistrationsPage />} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;
