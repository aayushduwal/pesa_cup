import {
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Flag,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Target,
  Trophy,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../css/Admin.css";
import AdminModal from "./AdminModal";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/registrations", label: "Registrations", icon: ClipboardList },
  { to: "/admin/fixtures", label: "Fixtures", icon: CalendarDays },
  { to: "/admin/standings", label: "Standings", icon: Trophy },
  { to: "/admin/scorers", label: "Scorers", icon: Target },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/tournaments", label: "Tournaments", icon: Flag },
  { to: "/admin/contacts", label: "Contacts", icon: Mail },
];

export default function AdminLayout() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const requestLogout = () => setConfirmLogout(true);
  const cancelLogout = () => setConfirmLogout(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    // Show the "more links" chevron only while there's still unscrolled
    // content to the right; hide it once the strip fits or is fully
    // scrolled to its end.
    const updateHint = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const hasOverflow = scrollWidth - clientWidth > 4;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 4;
      setShowScrollHint(hasOverflow && !atEnd);
    };

    updateHint();
    el.addEventListener("scroll", updateHint, { passive: true });
    window.addEventListener("resize", updateHint);

    return () => {
      el.removeEventListener("scroll", updateHint);
      window.removeEventListener("resize", updateHint);
    };
  }, []);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-brand-main">PESA CUP</span>
          <span className="admin-sidebar-brand-sub">Admin</span>
        </div>

        <div className="admin-nav-wrap">
          <nav className="admin-nav" ref={navRef}>
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `admin-nav-link${isActive ? " active" : ""}`
                }
              >
                <Icon size={18} strokeWidth={2} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          {showScrollHint && (
            <span className="admin-nav-more" aria-hidden="true">
              <ChevronRight size={16} />
            </span>
          )}
        </div>

        <button className="admin-logout" onClick={requestLogout}>
          <LogOut size={18} strokeWidth={2} />
          <span>Log out</span>
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>

      {confirmLogout && (
        <AdminModal title="Log out" onClose={cancelLogout}>
          <p className="admin-modal-text">
            Are you sure you want to log out of the PESA CUP admin panel?
          </p>
          <div className="admin-modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelLogout}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn admin-btn-danger"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
