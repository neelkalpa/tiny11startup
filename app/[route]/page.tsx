"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useUser, useClerk, UserButton } from '@clerk/nextjs';
import { Play, Download, Cpu, HardDrive, MemoryStick, Calendar, Settings } from "lucide-react";
import { OSRelease } from "@/lib/supabase";
import { LicenseKeyModal } from "@/components/LicenseKeyModal";
import { DownloadChoiceModal } from "@/components/DownloadChoiceModal";
import { useLicenseValidation } from "@/hooks/useLicenseValidation";
import { Navbar } from "@/components/Navbar";

export default function OSReleasePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const params = useParams();
  const route = params.route as string;
  const [osRelease, setOsRelease] = useState<OSRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedSignIn, setHasAttemptedSignIn] = useState(false);
  const [shouldReopenSignIn, setShouldReopenSignIn] = useState(false);
  const [hasValidSubscription, setHasValidSubscription] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [hasStandalonePurchase, setHasStandalonePurchase] = useState(false);
  const [standaloneLoading, setStandaloneLoading] = useState(false);
  const [showDownloadChoice, setShowDownloadChoice] = useState(false);
  const [individualLoading, setIndividualLoading] = useState(false);
  
  const {
    isModalOpen,
    isFirstTimeUser,
    checkUserAndShowModal,
    handleLicenseSubmit,
    processLicenseKey,
    processSkip,
    closeModal,
  } = useLicenseValidation();

  // Wrapper function to pass email to processSkip
  const handleSkip = useCallback(async () => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      await processSkip(user.emailAddresses[0].emailAddress);
    }
  }, [user, processSkip]);

  // Check subscription status
  const checkSubscriptionStatus = useCallback(async (email: string) => {
    setSubscriptionLoading(true);
    try {
      const response = await fetch(`/api/license?email=${encodeURIComponent(email)}&action=checkUser`);
      if (response.ok) {
        const data = await response.json();
        if (data.user && data.user.expirydate) {
          const expiryDate = new Date(data.user.expirydate);
          const now = new Date();
          setHasValidSubscription(expiryDate > now);
        } else {
          // NULL expirydate means no valid subscription
          setHasValidSubscription(false);
        }
      } else {
        setHasValidSubscription(false);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasValidSubscription(false);
    } finally {
      setSubscriptionLoading(false);
    }
  }, []);

  // Check standalone purchase status
  const checkStandalonePurchase = useCallback(async (email: string) => {
    setStandaloneLoading(true);
    try {
      const response = await fetch(`/api/check-standalone-purchase?email=${encodeURIComponent(email)}&route=${encodeURIComponent(route)}`);
      if (response.ok) {
        const data = await response.json();
        setHasStandalonePurchase(data.hasPurchased);
      } else {
        setHasStandalonePurchase(false);
      }
    } catch (error) {
      console.error('Error checking standalone purchase:', error);
      setHasStandalonePurchase(false);
    } finally {
      setStandaloneLoading(false);
    }
  }, [route]);

  // Handle PayPal payment
  const handlePayPalPayment = useCallback(async (downloadType: 'creator' | 'installer') => {
    if (!osRelease || !user?.emailAddresses?.[0]?.emailAddress) return;
    
    setPaypalLoading(true);
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Lifetime Access to ${osRelease.name} only`,
          description: `Lifetime Access to ${osRelease.name} only`,
          amount: osRelease.price,
          downloadType,
          email: user.emailAddresses[0].emailAddress,
          route: route,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.approvalUrl) {
          window.location.href = data.approvalUrl;
        }
      } else {
        console.error('Failed to create PayPal order');
      }
    } catch (error) {
      console.error('Error creating PayPal order:', error);
    } finally {
      setPaypalLoading(false);
    }
  }, [osRelease, user, route]);

  // Handle individual purchase choice
  const handleIndividualPurchase = useCallback(async (downloadType: 'creator' | 'installer') => {
    setIndividualLoading(true);
    await handlePayPalPayment(downloadType);
    setIndividualLoading(false);
    setShowDownloadChoice(false);
  }, [handlePayPalPayment]);

  // Handle subscription choice
  const handleSubscriptionChoice = useCallback(async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) return;
    
    setSubscriptionLoading(true);
    try {
      const response = await fetch('/api/paypal/create-route-subscription-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Tiny 11 Access - 1 Year',
          description: 'Tiny 11 Access - 1 Year',
          amount: 48,
          subscriptionType: '48',
          email: user.emailAddresses[0].emailAddress,
          returnRoute: route,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.approvalUrl) {
          window.location.href = data.approvalUrl;
        }
      } else {
        console.error('Failed to create subscription order');
      }
    } catch (error) {
      console.error('Error creating subscription order:', error);
    } finally {
      setSubscriptionLoading(false);
      setShowDownloadChoice(false);
    }
  }, [user, route]);

  // Auto-open sign-in modal if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn && openSignIn) {
      if (!hasAttemptedSignIn) {
        setHasAttemptedSignIn(true);
        openSignIn({
          redirectUrl: window.location.href,
        });
      } else if (shouldReopenSignIn) {
        // Reopen modal if user closed it without signing in
        openSignIn({
          redirectUrl: window.location.href,
        });
        setShouldReopenSignIn(false);
      }
    }
  }, [isLoaded, isSignedIn, openSignIn, hasAttemptedSignIn, shouldReopenSignIn]);

  // Poll to check if user closed modal without signing in
  useEffect(() => {
    if (!isSignedIn && hasAttemptedSignIn && isLoaded) {
      const pollInterval = setInterval(() => {
        // Check if user is still not signed in
        if (!isSignedIn) {
          setShouldReopenSignIn(true);
        }
      }, 2000); // Check every 2 seconds

      return () => clearInterval(pollInterval);
    }
  }, [isSignedIn, hasAttemptedSignIn, isLoaded]);

  // Check for first-time users when they sign in
  useEffect(() => {
    if (isSignedIn && user?.emailAddresses?.[0]?.emailAddress) {
      checkUserAndShowModal(user.emailAddresses[0].emailAddress);
      // Also check subscription status
      checkSubscriptionStatus(user.emailAddresses[0].emailAddress);
      // Check standalone purchase status
      checkStandalonePurchase(user.emailAddresses[0].emailAddress);
    }
  }, [isSignedIn, user, checkUserAndShowModal, checkSubscriptionStatus, checkStandalonePurchase]);

  useEffect(() => {
    const fetchOSRelease = async () => {
      try {
        const response = await fetch(`/api/os-releases/${route}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'OS release not found');
          return;
        }

        setOsRelease(data.release);
      } catch (err) {
        setError('Failed to load OS release');
      } finally {
        setLoading(false);
      }
    };

    if (route) {
      fetchOSRelease();
    }
  }, [route]);

  const formatRAM = (ram: number) => {
    if (ram >= 1024) {
      return `${(ram / 1024).toFixed(1)} GB`;
    }
    return `${ram} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const extractYouTubeId = (url: string) => {
    if (!url) return null;
    console.log('YouTube URL:', url);
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/.*[?&]v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        const id = match[1].substring(0, 11); // YouTube IDs are always 11 characters
        console.log('Extracted ID:', id);
        console.log('Thumbnail URL:', `https://img.youtube.com/vi/${id}/maxresdefault.jpg`);
        return id;
      }
    }
    
    console.log('No YouTube ID found');
    return null;
  };

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while sign-in modal is opening
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Opening sign-in...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !osRelease) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">OS Release Not Found</h1>
          <p className="text-gray-600 mb-4">The requested OS release could not be found.</p>
          <a href="/" className="btn-primary">Return Home</a>
        </div>
      </div>
    );
  }

  const youtubeId = extractYouTubeId(osRelease.youtube_link);
  console.log('Final youtubeId:', youtubeId);
  console.log('YouTube link:', osRelease.youtube_link);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container-custom py-32">
        <div className="max-w-4xl mx-auto">

          {/* Main Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Side - Video */}
            <div className="space-y-6">
              <div className="relative">
                {youtubeId ? (
                  <a
                    href={osRelease.youtube_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="relative rounded-2xl overflow-hidden bg-gray-900/50 border border-white/10 hover:border-rose-400/30 transition-colors group cursor-pointer">
                      <div className="aspect-video relative">
                        <img
                          src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                          alt={`${osRelease.name} preview`}
                          className="w-full h-full object-cover"
                          onLoad={() => console.log('Thumbnail loaded successfully')}
                          onError={(e) => {
                            console.log('Maxres thumbnail failed, trying hqdefault');
                            e.currentTarget.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                            e.currentTarget.onerror = () => {
                              console.log('HQ thumbnail failed, trying default');
                              e.currentTarget.src = `https://img.youtube.com/vi/${youtubeId}/default.jpg`;
                            };
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300 group-hover:scale-110 shadow-2xl">
                            <svg
                              className="w-8 h-8 text-white ml-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          YouTube
                        </div>
                      </div>
                    </div>
                  </a>
                ) : osRelease.youtube_link ? (
                  <a
                    href={osRelease.youtube_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="relative rounded-2xl overflow-hidden bg-gray-900/50 border border-white/10 hover:border-rose-400/30 transition-colors group cursor-pointer">
                      <div className="aspect-video relative">
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Video Preview</p>
                            <p className="text-sm opacity-75">Click to watch on YouTube</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300 group-hover:scale-110 shadow-2xl">
                            <svg
                              className="w-8 h-8 text-white ml-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          YouTube
                        </div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden bg-gray-900/50 border border-white/10">
                    <div className="aspect-video relative">
                      <div className="flex items-center justify-center h-full bg-gray-800">
                        <div className="text-center text-white">
                          <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Video Preview</p>
                          <p className="text-sm opacity-75">No video available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
            </div>

            {/* Right Side - Product Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{osRelease.name}</h2>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Released {formatDate(osRelease.release_date)}</span>
                </div>
              </div>

              <div className="text-4xl font-bold text-gray-900">
                {subscriptionLoading || standaloneLoading ? (
                  <div className="animate-pulse">Loading...</div>
                ) : hasValidSubscription ? (
                  <span className="text-green-600 text-2xl">Access Unlocked with Subscription</span>
                ) : hasStandalonePurchase ? (
                  <span className="text-green-600 text-2xl">Purchased</span>
                ) : (
                  `$${osRelease.price}`
                )}
              </div>

              <div className="space-y-3">
                {subscriptionLoading || standaloneLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-pulse text-gray-500">Checking access...</div>
                  </div>
                ) : hasValidSubscription || hasStandalonePurchase ? (
                  <>
                    <a
                      href={osRelease.creator_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-3"
                    >
                      <Download className="w-5 h-5" />
                      Download Creator
                    </a>
                    
                    <a
                      href={osRelease.download_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary w-full flex items-center justify-center gap-2 text-lg py-3"
                    >
                      <Download className="w-5 h-5" />
                      Download Installer
                    </a>
                  </>
                ) : (
                  <button
                    onClick={() => setShowDownloadChoice(true)}
                    disabled={paypalLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-5 h-5" />
                    {paypalLoading ? 'Processing...' : 'Get This Build'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Requirements and Disclaimer Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Requirements */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Minimum Requirements</h2>
              
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-900">Processor: </span>
                  <span className="text-gray-600">{osRelease.cpu}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-900">Minimum RAM: </span>
                  <span className="text-gray-600">{formatRAM(osRelease.minimum_ram)}</span>
                </div>

                {osRelease.recommended_ram && (
                  <div>
                    <span className="font-medium text-gray-900">Recommended RAM: </span>
                    <span className="text-gray-600">{formatRAM(osRelease.recommended_ram)}</span>
                  </div>
                )}

                <div>
                  <span className="font-medium text-gray-900">Space Required: </span>
                  <span className="text-gray-600">{osRelease.disk} GB</span>
                </div>

                {osRelease.other_req && osRelease.other_req.split('\n').map((line, index) => (
                  <div key={index}>
                    <span className="text-gray-600">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Disclaimer */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Important Notice</h2>
              <div className="text-gray-600 text-sm leading-relaxed">
                <p className="mb-3">
                  <strong>You are purchasing the Tiny 11 debloating service.</strong> You are not purchasing Windows 11, which belongs to Microsoft.
                </p>
                <p className="mb-3">
                  This service provides optimization tools to create tailored Windows 11 installations. Microsoft Windows 11 must be obtained separately through official channels.
                </p>
                <p className="text-gray-800 font-medium">
                  <strong>All purchases are final and cannot be refunded.</strong> It is the customer's responsibility to ensure their PC meets requirements and can run the software.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* License Key Modal */}
      {isModalOpen && (
        <LicenseKeyModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onLicenseSubmit={async (licenseKey) => {
            const result = await handleLicenseSubmit(
              licenseKey,
              user?.emailAddresses?.[0]?.emailAddress || ""
            );
            
            // If license validation is successful, reload the page
            if (result.valid) {
              setTimeout(() => {
                window.location.reload();
              }, 2000); // Wait 2 seconds to show success message
            }
            
            return result;
          }}
          onSkip={handleSkip}
          userEmail={user?.emailAddresses?.[0]?.emailAddress || ""}
        />
      )}

      {/* Download Choice Modal */}
      {showDownloadChoice && osRelease && (
        <DownloadChoiceModal
          isOpen={showDownloadChoice}
          onClose={() => setShowDownloadChoice(false)}
          onChooseIndividual={handleIndividualPurchase}
          onChooseSubscription={handleSubscriptionChoice}
          osReleaseName={osRelease.name}
          individualPrice={osRelease.price}
          subscriptionPrice={48}
          individualLoading={individualLoading}
          subscriptionLoading={subscriptionLoading}
        />
      )}
    </div>
  );
}
