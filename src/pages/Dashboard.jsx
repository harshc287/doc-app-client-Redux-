import React, { useEffect, useState } from "react";
import {
  FaSignOutAlt,
  FaUsers,
  FaPlus,
  FaUserMd,
  FaCalendarAlt,
  FaUserCircle,
  FaHome,
  FaBell,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../api/userAPI";

import Profile from "../components/Profile";
import Appointments from "../components/Appoinments";
import CreateAppointment from "../components/CreateAppoinment";
import DoctorsList from "../components/DoctorList";
import UsersList from "../components/UserList";
import ApplyDoctor from "../components/ApplyDoctor";
import DashboardHome from "../components/DashboardHome";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getLoggedUser();
      if (res.data.success) setUser(res.data.user);
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardHome user={user} />;
case "profile":
  return <Profile user={user} />;
      case "appointments":
        return <Appointments />;
      case "create-appointment":
        return <CreateAppointment />;
      case "doctors":
        return <DoctorsList />;
      case "users":
        return <UsersList />;
      case "apply-doctor":
        return <ApplyDoctor />;
      default:
        return null;
    }
  };

  const renderMenu = () => {
    if (!user) return null;

    const menu = [
      { label: "Dashboard", icon: <FaHome />, page: "dashboard" },
      { label: "Profile", icon: <FaUserCircle />, page: "profile" },
      { label: "Appointments", icon: <FaCalendarAlt />, page: "appointments" },
    ];

    if (user.role === "Admin") {
      menu.push(
        { label: "All Doctors", icon: <FaUserMd />, page: "doctors" },
        { label: "All Users", icon: <FaUsers />, page: "users" },
        { label: "Create Appointment", icon: <FaPlus />, page: "create-appointment" }
      );
    } else {
      menu.push(
        { label: "Create Appointment", icon: <FaPlus />, page: "create-appointment" },
        { label: "Apply for Doctor", icon: <FaUserMd />, page: "apply-doctor" }
      );
    }

    return menu.map((item) => (
      <button
        key={item.page}
        onClick={() => setActivePage(item.page)}
        className={`menu-btn ${
          activePage === item.page ? "menu-btn-active" : ""
        }`}
      >
        <span className="menu-icon">{item.icon}</span>
        <span className="menu-text">{item.label}</span>
      </button>
    ));
  };

  return (
    <div className="dashboard-wrapper">
      {/* TOP BAR */}
{/* TOP BAR */}
<nav className="topbar shadow-sm">
  {/* LEFT */}
  <div className="topbar-left">
    <button
      className="icon-btn d-lg-none"
      onClick={() => setSidebarOpen(!sidebarOpen)}
    >
      {sidebarOpen ? <FaTimes /> : <FaBars />}
    </button>

    <div className="brand">
      <div className="brand-icon">
        <FaUserMd />
      </div>
      <span className="brand-text">MediCare</span>
    </div>
  </div>

  {/* CENTER */}
  <div className="topbar-center d-none d-md-flex">
    <div className="search-box">
      <FaSearch />
      <input type="text" placeholder="Search..." />
    </div>
  </div>

  {/* RIGHT */}
  <div className="topbar-right">
    <button className="icon-btn position-relative">
      <FaBell />
      {notifications > 0 && (
        <span className="notify-badge">{notifications}</span>
      )}
    </button>

    <div className="user-box">
<div
  className="avatar"
  onClick={() => setActivePage("profile")}
  style={{ cursor: "pointer" }}
>
  {user?.profileImage ? (
    <img
      src={`http://localhost:7005${user.profileImage}`}
      alt="profile"
      style={{ width: "100%", height: "100%", borderRadius: "50%" }}
    />
  ) : (
    user?.name?.charAt(0)
  )}
</div>
<div
  className="user-info d-none d-md-block"
  onClick={() => setActivePage("profile")}
  style={{ cursor: "pointer" }}
>
  <strong>{user?.name}</strong>
  <small>{user?.role}</small>
</div>
    </div>

    <button onClick={handleLogout} className="logout-btn">
      <FaSignOutAlt />
      <span className="d-none d-md-inline">Logout</span>
    </button>
  </div>
</nav>


      <div className="dashboard-body">
        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-content">
            <h6>Navigation</h6>
            {renderMenu()}
          </div>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          {sidebarOpen && (
            <div className="mobile-backdrop d-lg-none" onClick={() => setSidebarOpen(false)} />
          )}

          <div className="page-header">
            <h2>Dashboard</h2>
            <p>Welcome back, {user?.name}</p>
          </div>

          <div className="content-box">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
