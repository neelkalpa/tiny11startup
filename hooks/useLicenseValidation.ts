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
      
      // Check if response is ok and content type is JSON
      if (!response.ok) {
        console.error("Error checking user: HTTP", response.status);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Error checking user: Response is not JSON");
        return;
      }

      const data = await response.json();

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

        // Check if response is ok and content type is JSON
        if (!response.ok) {
          console.error("Error validating license: HTTP", response.status);
          return { valid: false, error: "Server error" };
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Error validating license: Response is not JSON");
          return { valid: false, error: "Invalid response format" };
        }

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

        if (!response.ok) {
          console.error("Error processing license: HTTP", response.status);
          return false;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Error processing license: Response is not JSON");
          return false;
        }

        const data = await response.json();

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

      if (!response.ok) {
        console.error("Error processing skip: HTTP", response.status);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Error processing skip: Response is not JSON");
        return;
      }

      const data = await response.json();
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
