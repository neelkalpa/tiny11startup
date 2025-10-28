"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { CheckCircle, Crown, Key, Loader2 } from "lucide-react";
import Link from "next/link";

interface PlanData {
  expirydate: string | null;
  license_key: string | null;
}

export default function MyPlanPage() {
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanData>({ expirydate: null, license_key: null });
  const [newKey, setNewKey] = useState("");

  useEffect(() => {
    if (isSignedIn && user?.emailAddresses?.[0]?.emailAddress) {
      fetchPlan(user.emailAddresses[0].emailAddress);
    } else {
      setLoading(false);
    }
  }, [isSignedIn, user]);

  const fetchPlan = async (email: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/my-plan?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        setError("We couldn’t load your plan. Please try again.");
        return;
      }
      const data = await res.json();
      setPlan({ expirydate: data.expirydate ?? null, license_key: data.license_key ?? null });
    } catch {
      setError("We couldn't load your plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = async () => {
    if (!newKey.trim() || !user?.emailAddresses?.[0]?.emailAddress) return;
    try {
      setSaving(true);
      setError(null);
      const res = await fetch('/api/update-license-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.emailAddresses[0].emailAddress, licenseKey: newKey.trim() })
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "We couldn’t update your license key. Please try again.");
        return;
      }
      setPlan(prev => ({ ...prev, license_key: newKey.trim() }));
      setNewKey("");
      // Reload to reflect updated expiry date and state
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch {
      setError("We couldn't update your license key. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const isSubscriptionActive = () => {
    if (!plan.expirydate) return false;
    return new Date(plan.expirydate) > new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container-custom py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-8">Please sign in to view your plan.</p>
            <Link href="/" className="btn-primary">Go to Homepage</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container-custom py-24">
          <div className="max-w-2xl mx-auto text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-gray-900" />
            <p className="text-gray-600">Loading your plan...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderError = () => {
    if (!error) return null;
    const lower = error.toLowerCase();
    if (lower.includes('already associated') || lower.includes('already in use')) {
      return (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p>This license key is already associated with another account.</p>
          <p className="mt-1">
            If you think this is a mistake, contact <a className="underline text-red-800 hover:text-red-900" href="mailto:support@tiny11.ch">support@tiny11.ch</a>.
          </p>
        </div>
      );
    }
    return (
      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container-custom py-24">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Plan</h1>
            <p className="text-xl text-gray-600">Your subscription status and license key</p>
          </div>

          {/* Error */}
          {renderError()}

          {/* Subscription Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-gray-900" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Subscription</h3>
                  {isSubscriptionActive() ? (
                    <p className="text-gray-700">
                      Active • Valid until {formatDate(plan.expirydate!)}
                    </p>
                  ) : (
                    <p className="text-gray-700">No active subscription</p>
                  )}
                </div>
              </div>
              {isSubscriptionActive() && (
                <div className="flex items-center space-x-2 text-emerald-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">Active</span>
                </div>
              )}
            </div>
          </div>

          {/* License Key */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Key className="w-6 h-6 text-gray-900" />
              <h3 className="text-lg font-semibold text-gray-900">License Key</h3>
            </div>

            {plan.license_key ? (
              <div className="">
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Current Key</span>
                  <div className="mt-1 p-3 rounded-lg border border-gray-200 bg-gray-50 font-mono text-sm text-gray-900 break-all">
                    {plan.license_key}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Need to change it? Contact support at <a className="text-gray-800 hover:text-gray-900 hover:underline" href="mailto:support@tiny11.ch">support@tiny11.ch</a>.
                </div>
              </div>
            ) : isSubscriptionActive() ? (
              <div className="text-sm text-gray-700">
                Your subscription is active. A license key is not required.
              </div>
            ) : (
              <div className="">
                <label className="block text-sm text-gray-700 mb-2">Add License Key</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="Enter your license key"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  />
                  <button
                    onClick={handleSaveKey}
                    disabled={saving || !newKey.trim()}
                    className="btn-primary disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
