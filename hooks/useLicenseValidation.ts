"use client";

import { useState, useCallback } from "react";

export function useLicenseValidation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  const checkUserAndShowModal = useCallback(async (email: string) => {
    try {
      // Check if user exists in oauth table via API
      const response = await fetch(
        `/api/license?email=${encodeURIComponent(email)}&action=checkUser`
      );
      const data = await response.json();

      if (!response.ok) {
        console.error("Error checking user:", data.error);
        return;
      }

      if (!data.exists) {
        // First time user - show license key modal
        setIsFirstTimeUser(true);
        setIsModalOpen(true);
      }
      // If user exists, they already have their license set up
    } catch (error) {
      console.error("Error checking user:", error);
    }
  }, []);

  const handleLicenseSubmit = useCallback(
    async (
      licenseKey: string,
      email: string
    ): Promise<{ valid: boolean; error?: string }> => {
      try {
        // Validate the license key via API
        const response = await fetch("/api/license", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "validateLicense",
            email,
            licenseKey,
          }),
        });

        const data = await response.json();

        console.log("License validation response:", data);
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        // Always return the data from the API, regardless of HTTP status
        // The API returns 200 even for invalid licenses with valid: false
        console.log("Valid property:", data.valid);
        console.log("Error property:", data.error);
        return { valid: data.valid, error: data.error };
      } catch (error) {
        console.error("Error validating license:", error);
        return { valid: false, error: "An error occurred" };
      }
    },
    []
  );

  const processLicenseKey = useCallback(
    async (email: string, licenseKey: string): Promise<boolean> => {
      try {
        const response = await fetch("/api/license", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "validateLicense",
            email,
            licenseKey,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Error processing license:", data.error);
          return false;
        }

        return data.valid;
      } catch (error) {
        console.error("Error processing license key:", error);
        return false;
      }
    },
    []
  );

  const processSkip = useCallback(async (email: string) => {
    try {
      const response = await fetch("/api/license", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "skipLicense",
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error processing skip:", data.error);
      }
    } catch (error) {
      console.error("Error processing skip:", error);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsFirstTimeUser(false);
  }, []);

  return {
    isModalOpen,
    isFirstTimeUser,
    checkUserAndShowModal,
    handleLicenseSubmit,
    processLicenseKey,
    processSkip,
    closeModal,
  };
}
