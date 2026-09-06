'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/utils/firebase';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  email: string;
  college: string;
  isProfileComplete: boolean;
  registeredEvents?: string[];
  role?: 'superAdmin' | 'admin' | 'abheriAdmin' | 'user';
  department?: string; // For department admins
}

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = async (uid: string, email: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        
        // List of superAdmin emails (configurable via env)
        const superAdminEmails = (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || 'joeljoy1237@gmail.com')
          .split(',')
          .map(e => e.trim().toLowerCase());
        const isSuperAdmin = superAdminEmails.includes(email.toLowerCase());

        // Auto-promote configured users to superAdmin
        if (isSuperAdmin && data.role !== 'superAdmin') {
            await setDoc(userDocRef, { ...data, role: 'superAdmin' }, { merge: true });
            data.role = 'superAdmin';
        }

        // Ensure role exists, default to user if not
        if (!data.role) {
             data.role = 'user'; 
        }
        setUserData(data);
      } else {
        // Create initial user doc if it doesn't exist
        const superAdminEmails = (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || 'joeljoy1237@gmail.com')
          .split(',')
          .map(e => e.trim().toLowerCase());
        const isSuperAdmin = superAdminEmails.includes(email.toLowerCase());

        const initialData: UserProfile = {
          name: '',
          email: email,
          college: '',
          isProfileComplete: false,
          registeredEvents: [],
          role: isSuperAdmin ? 'superAdmin' : 'user'
        };
        await setDoc(userDocRef, initialData);
        setUserData(initialData);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.email) {
            await fetchUserProfile(currentUser.uid, currentUser.email);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const refetchUserProfile = async () => {
    if (user && user.email) {
      await fetchUserProfile(user.uid, user.email);
    }
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, login, logout, refetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
