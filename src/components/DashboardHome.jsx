import React, { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaUserMd,
  FaUsers,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import { getDashboardStats } from "../api/dashboardAPI";

const DashboardHome = ({ user }) => {
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardStats();
        if (res.data.success) {
          setStats([
            {
              label: "Total Appointments",
              value: res.data.stats.totalAppointments,
              icon: <FaCalendarCheck />,
              color: "bg-blue",
            },
            {
              label: "Doctors Online",
              value: res.data.stats.doctorsOnline,
              icon: <FaUserMd />,
              color: "bg-green",
            },
            {
              label: "Active Users",
              value: res.data.stats.activeUsers,
              icon: <FaUsers />,
              color: "bg-purple",
            },
            {
              label: "Pending Requests",
              value: res.data.stats.pendingRequests,
              icon: <FaClock />,
              color: "bg-yellow",
            },
          ]);

          setRecentActivities(res.data.recentActivities);
        }
      } catch (error) {
        console.error("Dashboard fetch failed", error);
      }
    };

    fetchDashboard();
  }, []);

  const quickActions = [
    { label: "Book Appointment", icon: <FaCalendarCheck />, page: "create-appointment" },
    { label: "View Schedule", icon: <FaClock />, page: "appointments" },
    { label: "Update Profile", icon: <FaUserMd />, page: "profile" },
  ];

  if (user?.role === "Doctor") {
    quickActions.push({
      label: "My Patients",
      icon: <FaUsers />,
      page: "appointments",
    });
  }

  return (
    <div className="dashboard-space">
      {/* Welcome Card */}
      <div className="welcome-card mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-bold mb-2">
              Welcome back, {user?.name}!
            </h3>
            <p className="welcome-text">
              {user?.role === "Doctor"
                ? "You have appointments scheduled."
                : user?.role === "Admin"
                ? "Manage the healthcare platform efficiently."
                : "Manage your health appointments with ease."}
            </p>
          </div>
          <FaChartLine className="welcome-icon d-none d-md-block" />
        </div>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
                <div className={`stat-icon ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-card mb-4">
        <h5 className="text-white mb-3">Quick Actions</h5>
        <div className="row g-3">
          {quickActions.map((action, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-4">
              <button className="quick-action-btn w-100">
                <span className="action-icon">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card">
        <h5 className="text-white mb-3">Recent Activity</h5>
        <div className="d-flex flex-column gap-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <span className={`activity-dot ${activity.status}`} />
              <div>
                <p className="mb-0 text-white">{activity.action}</p>
                <small className="text-muted">{activity.time}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
