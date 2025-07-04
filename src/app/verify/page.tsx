"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function VerifyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Get user data from URL params
  const userData = {
    phoneNumber: searchParams.get("phoneNumber") || "",
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    email: searchParams.get("email") || "",
    password: searchParams.get("password") || "",
    consentStatus: searchParams.get("consentStatus") === "true",
  };

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setVerificationError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setVerificationError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-registration-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: userData.phoneNumber,
          otp: otp,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          consentStatus: userData.consentStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      // Show success message
      setVerificationSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/registration-success");
      }, 2000);
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationError(
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again."
      );
      // Clear OTP input after error
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    setVerificationError(null);
    setCanResend(false);
    setCountdown(30);
    // Clear OTP input when resending
    setOtp("");

    try {
      // Call the registration API again to resend OTP
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          password: userData.password,
          consentStatus: userData.consentStatus
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend verification code");
      }

      // Show success message for resend
      setVerificationError(null);
    } catch (error) {
      console.error("Resend OTP error:", error);
      setVerificationError(
        error instanceof Error
          ? error.message
          : "Failed to resend OTP. Please try again."
      );
      setCanResend(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Verify Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit verification code to your phone number ending with{" "}
            <span className="font-medium">
              {userData.phoneNumber.slice(-4)}
            </span>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {verificationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center text-sm">
              <FiAlertCircle className="mr-2 h-4 w-4" />
              {verificationError}
            </div>
          )}

          {verificationSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center text-sm">
              <FiCheckCircle className="mr-2 h-4 w-4" />
              Verification successful! Redirecting...
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isLoading || verificationSuccess}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleVerifyOtp}
                className="px-10 mx-auto"
                disabled={otp.length !== 6 || isLoading || verificationSuccess}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Didn't receive the code?{" "}
                {canResend ? (
                  <button
                    onClick={handleResendOtp}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                    disabled={isLoading || verificationSuccess}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-gray-500">
                    Resend in {countdown} seconds
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Verify Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Loading...
            </p>
          </div>
        </div>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  );
} 