"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiLock, FiMail, FiAlertCircle, FiPhone } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Use environment variable for API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function RegistrationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Password validation function
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return errors;
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setRegisterError(null);
    
    // Basic validation
    if (!firstName.trim() || !lastName.trim()) {
      setRegisterError("Please enter your full name.");
      setIsLoading(false);
      return;
    }
    
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setRegisterError("First and last names must be at least 2 characters long.");
      setIsLoading(false);
      return;
    }
    
    if (!phoneNumber || phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      setRegisterError("Please enter a valid 10-digit phone number.");
      setIsLoading(false);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setRegisterError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    
    // Validate password
    const passwordValidationErrors = validatePassword(password);
    if (passwordValidationErrors.length > 0) {
      setRegisterError(`Password validation failed: ${passwordValidationErrors.join(', ')}`);
      setIsLoading(false);
      return;
    }
    
    if (!acceptTerms) {
      setRegisterError("You must accept the terms and conditions.");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
          consentStatus: acceptTerms
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Instead of redirecting to success page, redirect to verification page
      // with user data as query parameters
      const queryParams = new URLSearchParams({
        phoneNumber,
        firstName,
        lastName,
        email,
        password,
        consentStatus: acceptTerms.toString()
      }).toString();
      
      router.push(`/verify?${queryParams}`);
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  }

  const handleSocialRegistration = (provider: string) => {
    setIsLoading(true);
    setRegisterError(null);
    
    // Simulate social registration
    setTimeout(() => {
      setIsLoading(false);
      console.log(`Registering with ${provider}`);
      // In a real application, you would redirect to the OAuth provider
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {registerError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center text-sm mb-4">
          <FiAlertCircle className="mr-2 h-4 w-4" />
          {registerError}
        </div>
      )}

      
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="firstName"
                placeholder="" 
                className="pl-10" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="lastName"
                placeholder="" 
                className="pl-10" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        
        {/* Phone Number Field */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <div className="flex">
            <div className="flex-shrink-0 bg-gray-100 border border-gray-300 rounded-l-md px-3 py-0 text-gray-500 flex items-center justify-center select-none">
              +91
            </div>
            <div className="flex-grow relative">
              <FiPhone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="phoneNumber"
                type="tel"
                placeholder="" 
                className="rounded-l-none pl-10 w-full" 
                value={phoneNumber}
                onChange={(e) => {
                  // Only allow digits and limit to 10 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhoneNumber(value);
                }}
                required
              />
            </div>
          </div>
        </div>
        
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <FiMail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="email"
              type="email"
              placeholder="" 
              className="pl-10" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <FiLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="password"
              type="password" 
              placeholder="" 
              className={`pl-10 ${passwordErrors.length > 0 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              value={password}
              onChange={(e) => {
                const newPassword = e.target.value;
                setPassword(newPassword);
                setPasswordErrors(validatePassword(newPassword));
              }}
              required
            />
          </div>
          
          {/* Password Requirements */}
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-medium">Password requirements:</p>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <div className={`flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                At least 8 characters
              </div>
              <div className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                One uppercase letter (A-Z)
              </div>
              <div className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                One lowercase letter (a-z)
              </div>
              <div className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                One number (0-9)
              </div>
              <div className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                One special character (!@#$%^&*)
              </div>
            </div>
          </div>
        </div>
        
        {/* Terms and Conditions */}
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="terms" 
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked === true)}
            className="mt-1"
          />
          <div className="text-sm text-gray-700">
            I accept the <Link href="/legals/terms-conditions" className="font-medium text-gray-900  hover:underline">Terms and Conditions</Link> and <Link href="/legals/privacy-policy" className="font-medium text-gray-900 hover:underline">Privacy Policy</Link>
          </div>
        </div>
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
      
      <div className="text-center text-sm text-gray-600">
        <p>Already have an account?{" "}
          <Link href="/login" className="font-medium text-gray-900 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
} 