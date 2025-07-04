"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiPhone } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Phone login states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Handle phone number input to allow only digits and limit to 10 characters
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits
    const digitsOnly = value.replace(/\D/g, '');
    // Limit to 10 digits
    const limitedInput = digitsOnly.slice(0, 10);
    setPhoneNumber(limitedInput);
  };

  async function onPhoneSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    // Validate phone number (10 digits)
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length !== 10) {
      setLoginError("Please enter a valid 10-digit phone number.");
      setIsLoading(false);
      return;
    }
    
    try {
      // Call the login API to send OTP
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\D/g, '')
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setShowOtpInput(true);
      startCountdown();
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error instanceof Error
          ? error.message
          : "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (otp.length !== 6) {
      setLoginError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    try {
      // Call the verify OTP API
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-login-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\D/g, ''),
          otp: otp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // Store user data and tokens in localStorage
      if (data.success && data.data) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('tokens', JSON.stringify(data.data.tokens));
        
        // Check if profile is complete
        if (data.data.user.profileComplete) {
          // Redirect to dashboard if profile is complete
          router.push('/dashboard');
        } else {
          // Redirect to profile completion page if profile is not complete
          router.push('/profile');
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setLoginError(
        error instanceof Error
          ? error.message
          : "OTP verification failed. Please try again."
      );
      // Clear OTP input after error
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    setIsLoading(true);
    setLoginError(null);
    setCanResend(false);
    setCountdown(30);
    setOtp("");

    try {
      // Call the login API again to resend OTP
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\D/g, '')
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      startCountdown();
    } catch (error) {
      console.error("Resend OTP error:", error);
      setLoginError(
        error instanceof Error
          ? error.message
          : "Failed to resend OTP. Please try again."
      );
      setCanResend(true);
    } finally {
      setIsLoading(false);
    }
  }

  function startCountdown() {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  }

  return (
    <div className="space-y-6">
      {loginError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center text-sm mb-4">
          <FiAlertCircle className="mr-2 h-4 w-4" />
          {loginError}
        </div>
      )}
      
      {/* Phone Login Form */}
      {!showOtpInput && (
        <form onSubmit={onPhoneSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
              <Input 
                id="phoneNumber"
                type="tel"
                placeholder="10-digit phone number" 
                className="pl-10 h-12 text-base" 
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                maxLength={10}
                pattern="[0-9]{10}"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Sending OTP..." : "Get OTP"}
          </Button>
        </form>
      )}
      
      {/* OTP Verification Form */}
      {showOtpInput && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Enter the 6-digit code sent to your phone number
              <span className="font-medium"> {phoneNumber}</span>
            </p>
          </div>
          
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={isLoading}
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
          
          <Button 
            onClick={handleVerifyOtp} 
            className="w-full" 
            disabled={otp.length !== 6 || isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
          
          <div className="text-center text-sm">
            <p className="text-gray-600">
              Didn't receive the code?{" "}
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                  disabled={isLoading}
                  type="button"
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
      )}
      
      <div className="text-center text-sm text-gray-600">
        <p>Don't have an account?{" "}
          <a href="/register" className="font-medium text-gray-900 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
} 