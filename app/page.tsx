"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  Play,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Cpu,
  Palette,
  Download,
  Users,
} from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { CompareDemo } from "@/components/CompareDemo";
import { LicenseKeyModal } from "@/components/LicenseKeyModal";
import { Navbar } from "@/components/Navbar";
import { OSReleases } from "@/components/OSReleases";
import { useLicenseValidation } from "@/hooks/useLicenseValidation";

export default function Home() {
  const [subscriptionLoading, setSubscriptionLoading] = useState<string | null>(null);
  const { isSignedIn, user } = useUser();
  const {
    isModalOpen,
    isFirstTimeUser,
    checkUserAndShowModal,
    handleLicenseSubmit,
    processLicenseKey,
    processSkip,
    closeModal,
  } = useLicenseValidation();


  // Check for first-time users when they sign in
  useEffect(() => {
    if (isSignedIn && user?.emailAddresses?.[0]?.emailAddress) {
      checkUserAndShowModal(user.emailAddresses[0].emailAddress);
    }
  }, [isSignedIn, user, checkUserAndShowModal]);

  // Handle subscription payment
  const handleSubscriptionPayment = async (subscriptionType: string, amount: number, name: string) => {
    if (!user?.emailAddresses?.[0]?.emailAddress) return;
    
    setSubscriptionLoading(subscriptionType);
    try {
      const response = await fetch('/api/paypal/create-subscription-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          description: name,
          amount: amount,
          subscriptionType: subscriptionType,
          email: user.emailAddresses[0].emailAddress,
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
      setSubscriptionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20"
      >
        <div className="container-custom">
          {/* Text Content */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Rebuilt for Speed. Refined for You.
            </h1>
            <p className="h-sub mb-8">
              We build your Windows 11 the way it should be — clean, fast, and
              worry-free.
            </p>
            <div className="flex items-center justify-center gap-4">
              {isSignedIn ? (
                <button className="btn-primary flex items-center">
                  <Download className="mr-2 w-4 h-4" /> Start Optimization
                </button>
              ) : (
                <SignUpButton mode="modal">
                  <button className="btn-primary flex items-center">
                    <Download className="mr-2 w-4 h-4" /> Get Started
                  </button>
                </SignUpButton>
              )}
              <button className="btn-secondary flex items-center">
                <Play className="mr-2 w-4 h-4" /> View Demo
              </button>
            </div>
          </div>

          {/* Full Width Comparison Component */}
          <CompareDemo />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
              Why Choose Our Service
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional optimization that maximizes performance, enhances
              security, and delivers clean efficiency—without compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 md:p-8 card-hover">
              <Zap className="w-6 h-6 text-gray-900 mb-4" />
              <h3 className="font-semibold mb-2">
                Stop Waiting for Your Computer
              </h3>
              <p className="text-sm text-gray-600">
                Boot in 15 seconds instead of 2+ minutes. No more wasted time.
              </p>
            </div>
            <div className="card p-6 md:p-8 card-hover">
              <Shield className="w-6 h-6 text-gray-900 mb-4" />
              <h3 className="font-semibold mb-2">Trust What You Install</h3>
              <p className="text-sm text-gray-600">
                Free from the spyware other builds sneak in. Free builds cost
                your privacy — ours don't.
              </p>
            </div>
            <div className="card p-6 md:p-8 card-hover">
              <Cpu className="w-6 h-6 text-gray-900 mb-4" />
              <h3 className="font-semibold mb-2">Work Without Lag</h3>
              <p className="text-sm text-gray-600">
                Experience Windows that never freezes or lags.
              </p>
            </div>
            <div className="card p-6 md:p-8 card-hover">
              <Users className="w-6 h-6 text-gray-900 mb-4" />
              <h3 className="font-semibold mb-2">
                Support That Actually Helps
              </h3>
              <p className="text-sm text-gray-600">
                Real humans answer your questions. No chatbots or runarounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OS Releases Section */}
      <section id="releases" className="py-28 bg-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
              Available OS Releases
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our collection of optimized Windows 11 builds, each tailored for specific use cases and hardware configurations.
            </p>
          </div>
          
          <OSReleases />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-28 bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
              Choose Your Plan
            </h2>
            <p className="text-gray-800 font-semibold max-w-2xl mx-auto">
              Professional Windows 11 optimization tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Tiny 11 Access */}
            <div className="card p-8 text-center flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Tiny 11 Access</h3>
              <div className="text-3xl font-bold mb-2">
                $4<span className="text-lg text-gray-500">/month</span>
              </div>
              <div className="text-sm text-gray-500 mb-4 h-5">
                Billed annually
              </div>
              <p className="text-sm text-gray-600 mb-6 h-16 flex items-center justify-center text-center">
                Best for hobbyists: who want all public builds hassle-free.
              </p>

              <ul className="text-sm text-gray-600 mb-12 space-y-2 text-left flex-grow">
                <li>• All public Tiny 11 builds for 1 year</li>
                <li>• Regular updates included</li>
                <li>• Ready-to-use prebuilt systems</li>
                <li>• Priority email updates</li>
              </ul>

              <div className="mt-auto pt-6">
                {isSignedIn ? (
                  <button 
                    onClick={() => handleSubscriptionPayment('48', 48, 'Tiny 11 Access - 1 Year')}
                    disabled={subscriptionLoading === '48'}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscriptionLoading === '48' ? 'Processing...' : 'Subscribe'}
                  </button>
                ) : (
                  <SignUpButton mode="modal">
                    <button className="btn-primary w-full">Get Started</button>
                  </SignUpButton>
                )}
              </div>
            </div>

            {/* Tiny 11 Custom Starter */}
            <div className="card p-8 text-center border-2 border-gray-900 relative flex flex-col">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-1 rounded-full text-sm">
                Best Value
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Tiny 11 Custom Starter
              </h3>
              <div className="text-3xl font-bold mb-2">$240</div>
              <div className="text-sm text-gray-500 mb-4 h-5"></div>
              <p className="text-sm text-gray-600 mb-6 h-16 flex items-center justify-center text-center">
                You get a custom Tiny 11, built just for your PC + 1 year free
                access to public builds.
              </p>

              <ul className="text-sm text-gray-600 mb-12 space-y-2 text-left flex-grow">
                <li>• 1 custom Tiny 11 build tailored to you</li>
                <li>• 1-year access to all public builds</li>
                <li>• Privacy presets, performance tweaks</li>
                <li>• Priority human support</li>
              </ul>

              <div className="mt-auto pt-6">
                {isSignedIn ? (
                  <button 
                    onClick={() => handleSubscriptionPayment('240', 240, 'Tiny 11 Custom Starter')}
                    disabled={subscriptionLoading === '240'}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscriptionLoading === '240' ? 'Processing...' : 'Get Started'}
                  </button>
                ) : (
                  <SignUpButton mode="modal">
                    <button className="btn-primary w-full">Get Started</button>
                  </SignUpButton>
                )}
              </div>
            </div>

            {/* Tiny 11 Elite */}
            <div className="card p-8 text-center flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Tiny 11 Elite</h3>
              <div className="text-3xl font-bold mb-2">$399</div>
              <div className="text-sm text-gray-500 mb-4 h-5"></div>
              <p className="text-sm text-gray-600 mb-6 h-16 flex items-center justify-center text-center">
                Fully personalized Tiny 11s for your PCs, with lifetime public
                builds.
              </p>

              <ul className="text-sm text-gray-600 mb-12 space-y-2 text-left flex-grow">
                <li>• 2 custom Tiny 11 builds</li>
                <li>• Lifetime access to all public builds</li>
                <li>• Premium privacy & performance</li>
                <li>• Priority support with fast turnaround</li>
                <li>• Early access to experimental features</li>
              </ul>

              <div className="mt-auto pt-6">
                {isSignedIn ? (
                  <button 
                    onClick={() => handleSubscriptionPayment('399', 399, 'Tiny 11 Elite - Lifetime')}
                    disabled={subscriptionLoading === '399'}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscriptionLoading === '399' ? 'Processing...' : 'Go Elite'}
                  </button>
                ) : (
                  <SignUpButton mode="modal">
                    <button className="btn-primary w-full">Get Started</button>
                  </SignUpButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 border-t border-gray-200">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-semibold mb-3">Tiny 11</div>
              <p className="text-gray-600 mb-4 max-w-md text-sm">
                Professional system optimization service. Transform your
                existing setup into peak performance.
              </p>
              <p className="text-gray-600 max-w-md text-sm">
                For support and consultation & brand collabs, contact us at{' '}
                <a href="mailto:support@tiny11.ch" className="text-gray-800 hover:text-gray-900 hover:underline">
                  support@tiny11.ch
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sm">Support & Consultation</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="https://discord.gg/xBhDZ3abbx" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-gray-900 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div>
              © {new Date().getFullYear()} Tiny 11. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* License Key Modal */}
      {isFirstTimeUser && user?.emailAddresses?.[0]?.emailAddress && (
        <LicenseKeyModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onLicenseSubmit={async (licenseKey) => {
            const result = await handleLicenseSubmit(
              licenseKey,
              user.emailAddresses[0].emailAddress
            );
            console.log("Page received result from hook:", result);
            if (result.valid) {
              await processLicenseKey(
                user.emailAddresses[0].emailAddress,
                licenseKey
              );
            }
            console.log("Page returning to modal:", result);
            return result;
          }}
          onSkip={async () => {
            await processSkip(user.emailAddresses[0].emailAddress);
          }}
          userEmail={user.emailAddresses[0].emailAddress}
        />
      )}
    </div>
  );
}
