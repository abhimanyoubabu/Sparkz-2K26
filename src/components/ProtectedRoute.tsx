'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to home and prompt login
        toast.error("Please login to access this page");
        router.push('/');
      } else if (userData) {
        // Logged in
        if (!userData.isProfileComplete && pathname !== '/profile') {
           // Profile incomplete, force redirect to profile
           router.replace('/profile');
        }
      }
    }
  }, [user, userData, loading, router, pathname]);

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
     );
  }

  // If validation passes (or while we are redirecting), render null or children
  // Note: We might briefly flash children if we don't return null here while redirecting.
  // A safer bet is to only render children if valid conditions are met.
  
  if (!user) return null; // Redirecting...
  if (user && !userData?.isProfileComplete && pathname !== '/profile') return null; // Redirecting...

  return <>{children}</>;
}
