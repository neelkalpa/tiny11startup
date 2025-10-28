"use client";

import { useState } from "react";
import { Key, CheckCircle, AlertCircle } from "lucide-react";

interface LicenseKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLicenseSubmit: (
    licenseKey: string
  ) => Promise<{ valid: boolean; error?: string }>;
  onSkip: () => void;
  userEmail: string;
}

export function LicenseKeyModal({
  isOpen,
  onClose,
  onLicenseSubmit,
  onSkip,
  userEmail,
}: LicenseKeyModalProps) {
  const [licenseKey, setLicenseKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) return;

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await onLicenseSubmit(licenseKey.trim());
      console.log("Modal received result:", result);
      console.log("Result valid:", result.valid);
      console.log("Result error:", result.error);

      if (result.valid) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        console.log("Setting error message:", result.error);
        setError(
          result.error ||
            "Invalid license key. Please check and try again, or click Skip to continue without a license."
        );
      }
    } catch (err) {
      console.log("Modal caught error:", err);
      setError(
        "An error occurred. Please try again, or click Skip to continue without a license."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                License Key Verification
              </h2>
              <p className="text-sm text-gray-600">
                Verify your HT & Apidus license
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">
              Welcome! We found that you're signing in for the first time.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Do you have a license key from HT & Apidus? If so, enter it below
              to credit your account with the remaining validity.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500">
                Signed in as:{" "}
                <span className="font-medium text-gray-900">{userEmail}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="licenseKey"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                License Key
              </label>
              <input
                type="text"
                id="licenseKey"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="Enter your license key (e.g., c9325e8a-9aa2-4d7d-9d98-b69425ffdf1a)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm font-mono"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-700">
                  License key validated! Your account has been credited.
                </span>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading || !licenseKey.trim()}
                className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm"
              >
                {isLoading ? "Validating..." : "Validate License"}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                disabled={isLoading}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm"
              >
                Skip
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              You can add your license key later in your account settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
