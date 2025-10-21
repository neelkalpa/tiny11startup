'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Play, Star, ArrowRight, Menu, X, Zap, Shield, Cpu, Palette, Download, Users } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-colors duration-200 ${
        scrolled ? 'bg-white/90 backdrop-blur border-b border-gray-200' : 'bg-transparent'
      }`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center space-x-3">
              <div className="text-2xl font-semibold tracking-tight">Tiny 11</div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="link-muted">Features</a>
              <a href="#testimonials" className="link-muted">Reviews</a>
              <a href="#pricing" className="link-muted">Pricing</a>
              <a href="#contact" className="link-muted">Contact</a>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="btn-secondary">Sign In</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="btn-primary">Get Started</button>
                  </SignUpButton>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#features" className="block px-3 py-2 link-muted">Features</a>
                <a href="#testimonials" className="block px-3 py-2 link-muted">Reviews</a>
                <a href="#pricing" className="block px-3 py-2 link-muted">Pricing</a>
                <a href="#contact" className="block px-3 py-2 link-muted">Contact</a>
                <div className="px-3 py-2 space-y-2">
                  {isSignedIn ? (
                    <UserButton afterSignOutUrl="/" />
                  ) : (
                    <>
                      <SignInButton mode="modal">
                        <button className="btn-secondary w-full">Sign In</button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="btn-primary w-full">Get Started</button>
                      </SignUpButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="h-section mb-4">
              Your PC Instantly Faster
            </h1>
            <p className="h-sub mb-8">
              Transform your existing system into a streamlined powerhouse. Professional optimization service that delivers speed, security, and elegance.
            </p>
            <div className="flex items-center gap-4">
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
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Why Choose Our Service</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Professional optimization that maximizes performance, enhances security, and delivers clean efficiency—without compromise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="card p-10 md:p-12 card-hover">
              <Zap className="w-6 h-6 text-gray-900 mb-4" />
              <h3 className="font-semibold mb-2">Boot Optimization</h3>
              <p className="text-sm text-gray-600">Dramatically reduce startup times and improve system responsiveness.</p>
            </div>
            <div className="card p-10 md:p-12 card-hover">
              <Shield className="w-6 h-6 text-gray-900 mb-4" />
              <h3 className="font-semibold mb-2">Security Enhancement</h3>
              <p className="text-sm text-gray-600">Advanced security protocols with optimized performance impact.</p>
            </div>
            <div className="card p-10 md:p-12 card-hover">
              <Cpu className="w-6 h-6 text-gray-900 mb-4" />
              <h3 className="font-semibold mb-2">Resource Optimization</h3>
              <p className="text-sm text-gray-600">Minimize memory usage while maintaining full functionality.</p>
            </div>
            <div className="card p-10 md:p-12 card-hover">
              <Users className="w-6 h-6 text-gray-900 mb-4" />
              <h3 className="font-semibold mb-2">Expert Service</h3>
              <p className="text-sm text-gray-600">Professional optimization tailored to your specific needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-28">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Client Results</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Real feedback from professionals who demand peak performance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="card p-10 md:p-12">
              <div className="flex items-center mb-6 text-gray-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-sm">
                "The optimization service transformed my aging hardware. Incredible performance gains."
              </p>
              <div className="text-sm text-gray-500">John S., Developer</div>
            </div>
            <div className="card p-10 md:p-12">
              <div className="flex items-center mb-6 text-gray-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-sm">
                "Professional service delivered exactly what was promised. Clean, fast, reliable."
              </p>
              <div className="text-sm text-gray-500">Maria J., Designer</div>
            </div>
            <div className="card p-10 md:p-12">
              <div className="flex items-center mb-6 text-gray-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-sm">
                "Expert optimization without compromise. Maximum efficiency, zero bloat."
              </p>
              <div className="text-sm text-gray-500">David W., IT</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-28 bg-secondary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Ready to Optimize?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">Start with our consultation or explore premium optimization packages.</p>
          <div className="flex items-center justify-center gap-4">
            {isSignedIn ? (
              <button className="btn-primary flex items-center">
                <Download className="mr-2 w-4 h-4" /> Start Service
              </button>
            ) : (
              <SignUpButton mode="modal">
                <button className="btn-primary flex items-center">
                  <Download className="mr-2 w-4 h-4" /> Start Service
                </button>
              </SignUpButton>
            )}
            <button className="btn-secondary">View Packages</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 border-t border-gray-200">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-semibold mb-3">Tiny 11</div>
              <p className="text-gray-600 mb-4 max-w-md text-sm">
                Professional system optimization service. Transform your existing setup into peak performance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sm">Services</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Optimization</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Packages</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Consultation</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-sm">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div>© {new Date().getFullYear()} Tiny 11. All rights reserved.</div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}