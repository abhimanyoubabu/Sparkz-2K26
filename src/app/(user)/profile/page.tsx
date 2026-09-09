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
    <div className="min-h-screen py-20 px-4 md:px-8 max-w-4xl mx-auto text-[#221F1A]">
      <GradientBackground />
      <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-[#C19B4C] via-[#DEC077] to-[#C19B4C] bg-clip-text text-transparent">
        My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Details Section */}
        <div className="bg-[#FAF4E8] backdrop-blur-xl border border-[#DEC077] p-8 rounded-3xl h-fit shadow-md">
          <h2 className="text-xl font-bold mb-6 text-[#221F1A]">Personal Details</h2>
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#221F1A]/70 mb-2">Email</label>
              <input 
                type="email" 
                value={user.email || ''} 
                disabled 
                className="w-full bg-[#F9F6ED]/70 border border-[#DEC077]/50 rounded-xl px-4 py-3 text-[#221F1A]/60 cursor-not-allowed font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#221F1A]/70 mb-2">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-[#F9F6ED] border border-[#DEC077] rounded-xl px-4 py-3 text-[#221F1A] font-medium focus:outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] transition-all placeholder:text-[#221F1A]/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#221F1A]/70 mb-2">College</label>
              <input 
                type="text" 
                value={college} 
                onChange={(e) => setCollege(e.target.value)}
                placeholder="Enter your college name"
                className="w-full bg-[#F9F6ED] border border-[#DEC077] rounded-xl px-4 py-3 text-[#221F1A] font-medium focus:outline-none focus:ring-2 focus:ring-[#C19B4C]/30 focus:border-[#C19B4C] transition-all placeholder:text-[#221F1A]/30"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-4 w-full bg-[#E9D39D] border border-[#DEC077] hover:bg-[#dec077] text-[#221F1A] font-bold py-3.5 px-4 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              type="button"
              onClick={logout}
              className="mt-2 w-full bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-600 font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Registered Events Section */}
        <div className="bg-[#FAF4E8] backdrop-blur-xl border border-[#DEC077] p-8 rounded-3xl h-fit shadow-md">
          <h2 className="text-xl font-bold mb-6 text-[#221F1A]">Registered Events</h2>
          
          {userData?.registeredEvents && userData.registeredEvents.length > 0 ? (
            <ul className="space-y-3">
              {userData.registeredEvents.map((eventId, index) => (
                <li key={index} className="bg-[#F9F6ED] border border-[#DEC077]/70 p-4 rounded-xl flex items-center justify-between hover:border-[#C19B4C] transition-colors group shadow-xs">
                  <span className="font-semibold text-[#221F1A]">{eventId}</span> 
                  <span className="text-xs bg-[#E9D39D] text-[#221F1A] border border-[#DEC077] px-3 py-1 rounded-full font-bold">Registered</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12 text-[#221F1A]/60 bg-[#F9F6ED]/70 rounded-2xl border border-[#DEC077]/40">
              <p>You haven&apos;t registered for any events yet.</p>
              <button 
                onClick={() => router.push('/events')}
                className="mt-4 text-sm text-[#C19B4C] hover:text-[#221F1A] underline font-bold"
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
