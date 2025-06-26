'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile, logout } from '@/utils/auth';
import type { UserProfile, AuthUser } from '@/types/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      console.log('Dashboard: Starting to load user data...');
      try {
        // Add a small delay to ensure session is fully established
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const currentUser = await getCurrentUser();
        console.log('Dashboard: getCurrentUser result:', currentUser);
        
        if (!currentUser) {
          console.log('Dashboard: No current user, redirecting to auth');
          router.push('/auth');
          return;
        }
        
        console.log('Dashboard: User found, setting user state');
        setUser(currentUser);
        
        // Try to get user profile
        console.log('Dashboard: Fetching user profile...');
        const userProfile = await getUserProfile();
        console.log('Dashboard: User profile result:', userProfile);
        setProfile(userProfile);
      } catch (error) {
        console.error('Dashboard: Error loading user data:', error);
        window.location.href = '/auth';
      } finally {
        console.log('Dashboard: Finished loading, setting loading to false');
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-[var(--secondary)] border-t-transparent"></div>
          <span className="text-[var(--gray4)] font-[var(--system-font)]">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to /auth
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--gray3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-black font-[var(--font-space-grotesk)]">
                Dashboard
              </h1>
              <p className="text-[var(--gray4)] font-[var(--system-font)]">
                Welcome back, {profile?.name || user.name || user.email}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-[var(--gray4)] hover:text-red-600 transition-colors font-[var(--system-font)]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-[var(--gray3)] shadow-sm">
            <h2 className="text-lg font-semibold text-black font-[var(--font-space-grotesk)] mb-4">
              Your Profile
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-[var(--gray4)] font-[var(--system-font)]">Email</label>
                <p className="text-black font-[var(--system-font)]">{user.email}</p>
              </div>
              {profile?.name && (
                <div>
                  <label className="text-sm font-medium text-[var(--gray4)] font-[var(--system-font)]">Name</label>
                  <p className="text-black font-[var(--system-font)]">{profile.name}</p>
                </div>
              )}
              {profile?.organization && (
                <div>
                  <label className="text-sm font-medium text-[var(--gray4)] font-[var(--system-font)]">Organization</label>
                  <p className="text-black font-[var(--system-font)]">{profile.organization}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white p-6 rounded-2xl border border-[var(--gray3)] shadow-sm">
            <h2 className="text-lg font-semibold text-black font-[var(--font-space-grotesk)] mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/events')}
                className="w-full text-left p-3 rounded-lg border border-[var(--gray3)] hover:bg-gray-50 transition-colors"
              >
                <span className="text-black font-[var(--system-font)]">View Events</span>
              </button>
              <button 
                onClick={() => router.push('/blog')}
                className="w-full text-left p-3 rounded-lg border border-[var(--gray3)] hover:bg-gray-50 transition-colors"
              >
                <span className="text-black font-[var(--system-font)]">Read Blog Posts</span>
              </button>
              <button 
                onClick={() => router.push('/projects')}
                className="w-full text-left p-3 rounded-lg border border-[var(--gray3)] hover:bg-gray-50 transition-colors"
              >
                <span className="text-black font-[var(--system-font)]">View Projects</span>
              </button>
            </div>
          </div>

          {/* Authentication Status Card */}
          <div className="bg-white p-6 rounded-2xl border border-[var(--gray3)] shadow-sm">
            <h2 className="text-lg font-semibold text-black font-[var(--font-space-grotesk)] mb-4">
              Authentication Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[var(--gray4)] font-[var(--system-font)]">Status</span>
                <span className="text-green-600 font-bold font-[var(--system-font)]">✓ Authenticated</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--gray4)] font-[var(--system-font)]">Provider</span>
                <span className="text-black font-bold font-[var(--system-font)]">Supabase</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--gray4)] font-[var(--system-font)]">Database</span>
                <span className="text-black font-bold font-[var(--system-font)]">Prisma + PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 