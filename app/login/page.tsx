'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { motion } from 'framer-motion';
import { Swords, ArrowLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/app/lib/supabase';
import { useAuth } from '@/app/providers/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, isConfigured } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      const redirectTo = searchParams.get('redirectTo') || '/';
      router.push(redirectTo);
    }
  }, [user, loading, router, searchParams]);

  // If Supabase is not configured, show message
  if (!isConfigured) {
    return (
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          textAlign: 'center',
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>Auth Not Configured</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Authentication is not available. Please configure Supabase environment variables.
          </p>
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            Go Back
          </motion.button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="spin" style={{ color: 'var(--accent-primary)' }}>
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '420px',
        }}
      >
        {/* Back button */}
        <motion.button
          onClick={() => router.push('/')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            marginBottom: '24px',
            fontSize: '14px',
          }}
        >
          <ArrowLeft size={18} />
          Back to Home
        </motion.button>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}>
            <div style={{
              background: 'var(--accent-gradient)',
              borderRadius: '12px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Swords size={24} style={{ color: 'white' }} />
            </div>
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}>
            Fight Analyst
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}>
            Sign in to unlock unlimited analyses
          </p>
        </div>

        {/* Auth UI */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)',
          padding: '24px',
        }}>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#3b82f6',
                    brandAccent: '#2563eb',
                    inputBackground: 'rgba(255, 255, 255, 0.05)',
                    inputBorder: 'rgba(255, 255, 255, 0.1)',
                    inputText: '#ffffff',
                    inputPlaceholder: 'rgba(255, 255, 255, 0.4)',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
              style: {
                button: {
                  fontWeight: 500,
                  padding: '12px 16px',
                },
                input: {
                  padding: '12px 14px',
                },
                anchor: {
                  color: '#3b82f6',
                },
                message: {
                  color: '#ef4444',
                },
              },
            }}
            providers={['google']}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/`}
            view="sign_in"
            showLinks={true}
          />
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </main>
  );
}
