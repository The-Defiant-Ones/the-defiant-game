'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/app/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// ============================================================================
// Types
// ============================================================================

export interface UserSubscription {
  plan: 'free' | 'pro' | 'coach';
  status: string;
  current_period_end?: string;
}

export interface UserUsage {
  analyses_used: number;
  chat_messages_used: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: UserSubscription | null;
  usage: UserUsage | null;
  isConfigured: boolean;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  refreshUsage: () => Promise<void>;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  subscription: null,
  usage: null,
  isConfigured: false,
  signOut: async () => {},
  refreshSubscription: async () => {},
  refreshUsage: async () => {},
});

// ============================================================================
// Provider
// ============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const isConfigured = isSupabaseConfigured();

  // Fetch user subscription
  const refreshSubscription = useCallback(async () => {
    if (!user || !isConfigured) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan, status, current_period_end')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // No subscription found - default to free
        setSubscription({ plan: 'free', status: 'active' });
      } else {
        setSubscription(data);
      }
    } catch (err) {
      console.warn('Failed to fetch subscription:', err);
      setSubscription({ plan: 'free', status: 'active' });
    }
  }, [user, isConfigured]);

  // Fetch user usage for current period
  const refreshUsage = useCallback(async () => {
    if (!user || !isConfigured) return;

    try {
      // Get current month start (for free users)
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];

      const { data, error } = await supabase
        .from('usage')
        .select('analyses_used, chat_messages_used')
        .eq('user_id', user.id)
        .eq('period_start', periodStart)
        .single();

      if (error) {
        // No usage record - start fresh
        setUsage({ analyses_used: 0, chat_messages_used: 0 });
      } else {
        setUsage(data);
      }
    } catch (err) {
      console.warn('Failed to fetch usage:', err);
      setUsage({ analyses_used: 0, chat_messages_used: 0 });
    }
  }, [user, isConfigured]);

  // Initialize auth state
  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => authSubscription.unsubscribe();
  }, [isConfigured]);

  // Fetch subscription and usage when user changes
  useEffect(() => {
    if (user) {
      refreshSubscription();
      refreshUsage();
    } else {
      setSubscription(null);
      setUsage(null);
    }
  }, [user, refreshSubscription, refreshUsage]);

  // Sign out handler
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setSubscription(null);
    setUsage(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        subscription,
        usage,
        isConfigured,
        signOut,
        refreshSubscription,
        refreshUsage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ============================================================================
// Plan Limits Helper
// ============================================================================

export const PLAN_LIMITS = {
  free: { analyses: 3, chat_messages: 30 },
  pro: { analyses: -1, chat_messages: -1 }, // unlimited
  coach: { analyses: -1, chat_messages: -1 }, // unlimited
} as const;

export function canAnalyze(subscription: UserSubscription | null, usage: UserUsage | null): boolean {
  if (!subscription || !usage) return true; // Allow if not tracked
  const limit = PLAN_LIMITS[subscription.plan].analyses;
  if (limit === -1) return true; // Unlimited
  return usage.analyses_used < limit;
}

export function getAnalysesRemaining(
  subscription: UserSubscription | null,
  usage: UserUsage | null
): number | 'unlimited' {
  if (!subscription || !usage) return 'unlimited';
  const limit = PLAN_LIMITS[subscription.plan].analyses;
  if (limit === -1) return 'unlimited';
  return Math.max(0, limit - usage.analyses_used);
}
