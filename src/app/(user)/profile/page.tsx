'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {toastSuccess, toastError} from '@/utils/common/Toast';
import GradientBackground from '@/components/ui/GradientBackground';

export default function ProfilePage() {
  const { user, userData, loading, refetchUserProfile, logout } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setCollege(userData.college || '');
    }
  }, [userData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!name.trim() || !college.trim()) {
      toastError("Please fill in all fields.");
      return;
    }

    setSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: name.trim(),
        college: college.trim(),
        isProfileComplete: true
      });
      await refetchUserProfile();
      toastSuccess("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toastError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen py-20 px-4 md:px-8 max-w-4xl mx-auto text-white">
      <GradientBackground />
      <h1 className="text-4xl font-bold mb-8 bg-linear-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
        My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Details Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl h-fit shadow-2xl">
          <h2 className="text-xl font-semibold mb-6 text-indigo-200">Personal Details</h2>
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input 
                type="email" 
                value={user.email || ''} 
                disabled 
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all placeholder:text-white/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">College</label>
              <input 
                type="text" 
                value={college} 
                onChange={(e) => setCollege(e.target.value)}
                placeholder="Enter your college name"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all placeholder:text-white/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-4 w-full bg-linear-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              type="button"
              onClick={logout}
              className="mt-2 w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Registered Events Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl h-fit shadow-2xl">
          <h2 className="text-xl font-semibold mb-6 text-indigo-200">Registered Events</h2>
          
          {userData?.registeredEvents && userData.registeredEvents.length > 0 ? (
            <ul className="space-y-3">
              {userData.registeredEvents.map((eventId, index) => (
                <li key={index} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors group">
                  <span className="font-medium text-white/90">{eventId}</span> 
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full group-hover:bg-indigo-500/30 transition-colors">Registered</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12 text-gray-400 bg-white/5 rounded-2xl border border-white/5">
              <p>You haven't registered for any events yet.</p>
              <button 
                onClick={() => router.push('/events')}
                className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Browse Events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
