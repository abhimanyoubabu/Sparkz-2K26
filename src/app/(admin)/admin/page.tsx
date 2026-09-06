"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FiUsers, FiCalendar, FiList, FiTrendingUp } from "react-icons/fi";

export default function AdminDashboard() {
  const { userData } = useAuth();

  if (!userData) return null;

  const stats = [
    { title: "Total Users", value: "...", icon: FiUsers, color: "bg-blue-500/10 text-blue-400" },
    { title: "Total Events", value: "...", icon: FiCalendar, color: "bg-fuchsia-500/10 text-fuchsia-400" },
    { title: "Registrations", value: "...", icon: FiList, color: "bg-emerald-500/10 text-emerald-400" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">Welcome back, {userData.name}</p>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userData.role === 'superAdmin' && (
             <Link href="/admin/users" className="group p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-indigo-500/50 transition-all hover:bg-gray-800">
                <div className="text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                    <FiUsers size={32} />
                </div>
                <h3 className="text-lg font-semibold text-white">Manage Users</h3>
                <p className="text-sm text-gray-500 mt-2">View users and assign roles.</p>
             </Link>
        )}

        <Link href="/admin/events" className="group p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-fuchsia-500/50 transition-all hover:bg-gray-800">
            <div className="text-fuchsia-400 mb-4 group-hover:scale-110 transition-transform">
                <FiCalendar size={32} />
            </div>
            <h3 className="text-lg font-semibold text-white">Manage Events</h3>
            <p className="text-sm text-gray-500 mt-2">Create and edit events.</p>
        </Link>
        
        <Link href="/admin/registrations" className="group p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-emerald-500/50 transition-all hover:bg-gray-800">
            <div className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <FiList size={32} />
            </div>
            <h3 className="text-lg font-semibold text-white">View Registrations</h3>
            <p className="text-sm text-gray-500 mt-2">Check who registered & export data.</p>
        </Link>
      </div>
    </div>
  );
}
