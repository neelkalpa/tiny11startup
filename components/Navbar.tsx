"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Package, CreditCard } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  // Debug logging
  console.log('Navbar - isSignedIn:', isSignedIn, 'user:', user);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isAccountDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.account-dropdown')) {
          setIsAccountDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountDropdownOpen]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="text-2xl font-semibold tracking-tight">
              Tiny 11
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#home" className="link-muted">
              Home
            </Link>
            <Link href="/#features" className="link-muted">
              Features
            </Link>
            <Link href="/#releases" className="link-muted">
              Releases
            </Link>
            <Link href="/#pricing" className="link-muted">
              Pricing
            </Link>
            <Link href="/faq" className="link-muted">
              FAQ
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <>
                {/* My Account Dropdown */}
                <div className="relative account-dropdown">
                  <button
                    onClick={() => {
                      console.log('Dropdown clicked, current state:', isAccountDropdownOpen);
                      setIsAccountDropdownOpen(!isAccountDropdownOpen);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium">My Account</span>
                    <ChevronDown size={16} className={`transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isAccountDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        href="/my-orders"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsAccountDropdownOpen(false)}
                      >
                        <Package size={16} />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        href="/my-plan"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsAccountDropdownOpen(false)}
                      >
                        <CreditCard size={16} />
                        <span>My Plan</span>
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Clerk UserButton */}
                <UserButton afterSignOutUrl="/" />
              </>
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
              <Link href="/#home" className="block px-3 py-2 link-muted">
                Home
              </Link>
              <Link href="/#features" className="block px-3 py-2 link-muted">
                Features
              </Link>
              <Link href="/#releases" className="block px-3 py-2 link-muted">
                Releases
              </Link>
              <Link href="/#pricing" className="block px-3 py-2 link-muted">
                Pricing
              </Link>
              <Link href="/faq" className="block px-3 py-2 link-muted">
                FAQ
              </Link>
              <div className="px-3 py-2 space-y-2">
                {isSignedIn ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">My Account</span>
                    </div>
                    <Link
                      href="/my-orders"
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Package size={16} />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      href="/my-plan"
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <CreditCard size={16} />
                      <span>My Plan</span>
                    </Link>
                    <div className="pt-2">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </div>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button className="btn-secondary w-full">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="btn-primary w-full">
                        Get Started
                      </button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
