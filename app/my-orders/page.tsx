"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Download, CheckCircle, Crown, Package } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { OSRelease } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";


interface SubscriptionStatus {
  hasSubscription: boolean;
  expiryDate: string | null;
}

export default function MyOrdersPage() {
  const { isSignedIn, user } = useUser();
  const [purchasedReleases, setPurchasedReleases] = useState<OSRelease[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({ hasSubscription: false, expiryDate: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn && user?.emailAddresses?.[0]?.emailAddress) {
      fetchUserData(user.emailAddresses[0].emailAddress);
    }
  }, [isSignedIn, user]);

  const fetchUserData = async (email: string) => {
    try {
      setLoading(true);
      
      // Fetch purchased releases
      const purchasesResponse = await fetch(`/api/my-purchases?email=${encodeURIComponent(email)}`);
      if (purchasesResponse.ok) {
        const purchasesData = await purchasesResponse.json();
        setPurchasedReleases(purchasesData.releases || []);
      } else {
        console.error('Failed to fetch purchases:', await purchasesResponse.text());
      }

      // Fetch subscription status
      const subscriptionResponse = await fetch(`/api/subscription-status?email=${encodeURIComponent(email)}`);
      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        setSubscriptionStatus(subscriptionData);
      } else {
        console.error('Failed to fetch subscription:', await subscriptionResponse.text());
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSubscriptionDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isSubscriptionActive = () => {
    if (!subscriptionStatus.hasSubscription || !subscriptionStatus.expiryDate) return false;
    return new Date(subscriptionStatus.expiryDate) > new Date();
  };

  const extractYouTubeId = (url: string) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/.*[?&]v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const getThumbnailUrl = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  const handleDownload = async (route: string, downloadType: 'creator' | 'installer') => {
    try {
      const response = await fetch(`/api/download-${downloadType}?route=${route}`);
      if (response.ok) {
        const data = await response.json();
        if (data.downloadUrl) {
          window.open(data.downloadUrl, '_blank');
        }
      } else {
        console.error('Failed to get download link');
      }
    } catch (error) {
      console.error('Error downloading:', error);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container-custom py-32">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-8">Please sign in to view your orders and downloads.</p>
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
        <div className="container-custom py-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container-custom py-32">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button 
              onClick={() => user?.emailAddresses?.[0]?.emailAddress && fetchUserData(user.emailAddresses[0].emailAddress)}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container-custom py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Orders</h1>
            <p className="text-xl text-gray-600">Your purchased Tiny 11 builds and subscription status</p>
          </div>

          {/* Subscription Status */}
          {isSubscriptionActive() && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Crown className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-xl font-semibold text-green-900">Active Subscription</h3>
                    <p className="text-green-700">
                      Valid until {formatSubscriptionDate(subscriptionStatus.expiryDate!)}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      You can download any Tiny 11 build you want
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* Purchased Releases */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Purchases ({purchasedReleases.length})
            </h2>
            
            {purchasedReleases.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Purchases Yet</h3>
                <p className="text-gray-600 mb-6">You haven&apos;t purchased any individual builds yet.</p>
                <Link href="/#releases" className="btn-primary">Browse Available Builds</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {purchasedReleases.map((release) => {
                  const youtubeId = extractYouTubeId(release.youtube_link);
                  const thumbnailUrl = youtubeId ? getThumbnailUrl(youtubeId) : null;
                  
                  return (
                    <div key={release.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Thumbnail */}
                      <div className="aspect-video bg-gray-100 relative">
                        {thumbnailUrl ? (
                          <Image
                            src={thumbnailUrl}
                            alt={release.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (youtubeId) {
                                target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Purchased
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                          {release.name}
                        </h3>
                        
                        <div className="text-xs text-gray-500 mb-3">
                          {formatDate(release.release_date)}
                        </div>

                        {/* Download Buttons */}
                        <div className="space-y-2">
                          <button
                            onClick={() => handleDownload(release.route, 'creator')}
                            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                          >
                            <Download className="w-3 h-3" />
                            <span>Creator</span>
                          </button>
                          <button
                            onClick={() => handleDownload(release.route, 'installer')}
                            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                          >
                            <Download className="w-3 h-3" />
                            <span>Installer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Subscription Access Info */}
          {isSubscriptionActive() && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscription Benefits</h3>
              <p className="text-gray-700 mb-4">
                With your active subscription, you can download any Tiny 11 build from our releases page, 
                even if you haven&apos;t purchased it individually.
              </p>
              <Link href="/#releases" className="btn-primary">
                Browse All Available Builds
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
