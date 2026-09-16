import { CalendarDays, ClipboardList, Image, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminAuthError } from "../api/adminClient";
import { RegistrationsAdminAPI } from "../api/registrations.admin";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../css/Admin.css";

export default function Dashboard() {
  const { logout } = useAdminAuth();
  const [pendingCount, setPendingCount] = useState(null);

  useEffect(() => {
    RegistrationsAdminAPI.getAll()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data ?? []);
        setPendingCount(list.filter((r) => r.status === "PENDING").length);
      })
      .catch((err) => {
        if (err instanceof AdminAuthError) logout();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Quick overview of what needs attention.</p>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <Link to="/admin/registrations" className="admin-dashboard-card">
          <ClipboardList size={28} />
          <span className="admin-dashboard-card-value">
            {pendingCount === null ? "—" : pendingCount}
          </span>
          <span className="admin-dashboard-card-label">
            Pending registrations
          </span>
        </Link>

        <Link to="/admin/fixtures" className="admin-dashboard-card">
          <CalendarDays size={28} />
          <span className="admin-dashboard-card-label">Manage fixtures</span>
        </Link>

        <Link to="/admin/standings" className="admin-dashboard-card">
          <Trophy size={28} />
          <span className="admin-dashboard-card-label">Manage standings</span>
        </Link>

        <Link to="/admin/gallery" className="admin-dashboard-card">
          <Image size={28} />
          <span className="admin-dashboard-card-label">Manage gallery</span>
        </Link>
      </div>
    </div>
  );
}
