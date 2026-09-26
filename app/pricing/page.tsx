'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Swords, ArrowLeft, Loader2, Zap, Users, Crown } from 'lucide-react';
import { useAuth, PLAN_LIMITS } from '@/app/providers/AuthProvider';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// ============================================================================
// Plan Configuration
// ============================================================================

interface Plan {
  id: 'free' | 'pro' | 'coach';
  name: string;
  icon: typeof Zap;
  price: { monthly: number; annual: number };
  priceId: { monthly: string; annual: string };
  features: string[];
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    icon: Zap,
    price: { monthly: 0, annual: 0 },
    priceId: { monthly: '', annual: '' },
    features: [
      '3 analyses per month',
      'Basic fight breakdown',
      '10 chat messages per analysis',
      'Key moments timeline',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Users,
    price: { monthly: 19, annual: 149 },
    priceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
      annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL || '',
    },
    features: [
      'Unlimited analyses',
      'Full tactical breakdown',
      'Unlimited chat messages',
      'PDF export',
      'Timestamped clips',
      'Priority processing',
    ],
    highlighted: true,
  },
  {
    id: 'coach',
    name: 'Coach',
    icon: Crown,
    price: { monthly: 49, annual: 399 },
    priceId: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_COACH_MONTHLY || '',
      annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_COACH_ANNUAL || '',
    },
    features: [
      'Everything in Pro',
      'Team sharing (coming soon)',
      'API access (coming soon)',
      'Custom training plans',
      'Priority support',
      'Early access to features',
    ],
  },
];

// ============================================================================
// Component
// ============================================================================

export default function PricingPage() {
  const router = useRouter();
  const { user, session, subscription, loading } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (plan: Plan) => {
    // Free plan - no action needed
    if (plan.id === 'free') {
      router.push('/');
      return;
    }

    // Require login first
    if (!user) {
      router.push(`/login?redirectTo=/pricing`);
      return;
    }

    const priceId = plan.priceId[billingPeriod];
    if (!priceId) {
      alert('This plan is not available yet. Please try again later.');
      return;
    }

    setLoadingPlan(plan.id);

    try {
      const response = await fetch(`${BACKEND_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const currentPlan = subscription?.plan || 'free';

  return (
    <main style={{
      minHeight: '100vh',
      padding: '32px 20px',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
            marginBottom: '32px',
            fontSize: '14px',
          }}
        >
          <ArrowLeft size={18} />
          Back to Home
        </motion.button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px',
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
            fontSize: '36px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}>
            Upgrade Your Game
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            Get unlimited AI-powered fight analysis to take your training to the next level
          </p>
        </div>

        {/* Billing Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px',
        }}>
          <div style={{
            display: 'flex',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            padding: '4px',
          }}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: billingPeriod === 'monthly' ? 'var(--accent-primary)' : 'transparent',
                color: billingPeriod === 'monthly' ? 'white' : 'var(--text-secondary)',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: billingPeriod === 'annual' ? 'var(--accent-primary)' : 'transparent',
                color: billingPeriod === 'annual' ? 'white' : 'var(--text-secondary)',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Annual
              <span style={{
                marginLeft: '8px',
                fontSize: '11px',
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                Save 35%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '48px',
        }}>
          {PLANS.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id;
            const Icon = plan.icon;
            const price = plan.price[billingPeriod];
            const isLoading = loadingPlan === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: plan.highlighted ? 1.02 : 1.01 }}
                style={{
                  background: plan.highlighted
                    ? 'linear-gradient(145deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))'
                    : 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  border: plan.highlighted
                    ? '2px solid rgba(59, 130, 246, 0.4)'
                    : '1px solid var(--glass-border)',
                  padding: '28px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Popular Badge */}
                {plan.highlighted && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'var(--accent-gradient)',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                }}>
                  <div style={{
                    background: plan.highlighted
                      ? 'var(--accent-gradient)'
                      : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={22} style={{ color: plan.highlighted ? 'white' : 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}>
                      {plan.name}
                    </h3>
                  </div>
                </div>

                {/* Price */}
                <div style={{ marginBottom: '24px' }}>
                  <span style={{
                    fontSize: '42px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}>
                    ${price}
                  </span>
                  {price > 0 && (
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--text-muted)',
                      marginLeft: '4px',
                    }}>
                      /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  marginBottom: '28px',
                }}>
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        marginBottom: '12px',
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <Check
                        size={18}
                        style={{
                          color: plan.highlighted ? '#3b82f6' : '#22c55e',
                          flexShrink: 0,
                          marginTop: '1px',
                        }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan || isLoading}
                  whileHover={!isCurrentPlan && !isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isCurrentPlan && !isLoading ? { scale: 0.98 } : {}}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isCurrentPlan
                      ? 'rgba(255, 255, 255, 0.1)'
                      : plan.highlighted
                        ? 'var(--accent-gradient)'
                        : 'rgba(255, 255, 255, 0.1)',
                    color: isCurrentPlan
                      ? 'var(--text-muted)'
                      : plan.highlighted
                        ? 'white'
                        : 'var(--text-primary)',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: isCurrentPlan || isLoading ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: isCurrentPlan ? 0.5 : 1,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : plan.id === 'free' ? (
                    'Get Started'
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '24px',
          }}>
            Questions?
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}>
            All plans include our core fight analysis features. Pro and Coach plans
            unlock unlimited usage and additional features. You can upgrade, downgrade,
            or cancel at any time through your account settings.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </main>
  );
}
