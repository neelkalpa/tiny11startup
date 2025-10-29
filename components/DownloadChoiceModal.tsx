"use client";

import React, { useState } from "react";
import { X, Download, Crown, Zap } from "lucide-react";
import { TermsAcceptanceModal } from "./TermsAcceptanceModal";

interface DownloadChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChooseIndividual: (downloadType: 'creator' | 'installer') => void;
  onChooseSubscription: () => void;
  osReleaseName: string;
  individualPrice: number;
  subscriptionPrice: number;
  individualLoading: boolean;
  subscriptionLoading: boolean;
}

export function DownloadChoiceModal({
  isOpen,
  onClose,
  onChooseIndividual,
  onChooseSubscription,
  osReleaseName,
  individualPrice,
  subscriptionPrice,
  individualLoading,
  subscriptionLoading,
}: DownloadChoiceModalProps) {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'individual' | 'subscription';
    downloadType?: 'creator' | 'installer';
  } | null>(null);

  const handleIndividualClick = (downloadType: 'creator' | 'installer') => {
    setPendingAction({ type: 'individual', downloadType });
    setShowTermsModal(true);
  };

  const handleSubscriptionClick = () => {
    setPendingAction({ type: 'subscription' });
    setShowTermsModal(true);
  };

  const handleTermsAccept = () => {
    if (pendingAction?.type === 'individual' && pendingAction.downloadType) {
      onChooseIndividual(pendingAction.downloadType);
    } else if (pendingAction?.type === 'subscription') {
      onChooseSubscription();
    }
    setShowTermsModal(false);
    setPendingAction(null);
  };

  const handleTermsClose = () => {
    setShowTermsModal(false);
    setPendingAction(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Choose Your Option</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            You can either get just this specific build or get access to all Tiny 11 builds for a year.
          </p>

          <div className="space-y-4">
            {/* Individual Purchase Option */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">Just This Build</h3>
                  <p className="text-sm text-gray-600">{osReleaseName}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">${individualPrice}</div>
                  <div className="text-xs text-gray-500">One-time</div>
                </div>
              </div>
              <button
                onClick={() => handleIndividualClick('creator')}
                disabled={individualLoading || subscriptionLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                {individualLoading ? 'Processing...' : 'Get Access'}
              </button>
            </div>

            {/* Subscription Option */}
            <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <h3 className="font-medium text-gray-900">All Tiny 11 Builds</h3>
                  </div>
                  <p className="text-sm text-gray-600">1 year access to all public builds</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">${subscriptionPrice}</div>
                  <div className="text-xs text-gray-500">Per year</div>
                </div>
              </div>
              <button
                onClick={handleSubscriptionClick}
                disabled={individualLoading || subscriptionLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Zap className="w-4 h-4" />
                {subscriptionLoading ? 'Processing...' : 'Get Yearly Access'}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Terms Acceptance Modal */}
      <TermsAcceptanceModal
        isOpen={showTermsModal}
        onClose={handleTermsClose}
        onAccept={handleTermsAccept}
        title={pendingAction?.type === 'individual' ? 'Purchase Confirmation' : 'Subscription Confirmation'}
        description={
          pendingAction?.type === 'individual' 
            ? `You are about to purchase access to ${osReleaseName} for $${individualPrice}. This is a one-time purchase.`
            : `You are about to subscribe to all Tiny 11 builds for $${subscriptionPrice}.`
        }
        actionText={pendingAction?.type === 'individual' ? 'Continue to Payment' : 'Continue to Subscription'}
        loading={individualLoading || subscriptionLoading}
      />
    </div>
  );
}
