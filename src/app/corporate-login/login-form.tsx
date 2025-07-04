"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiMail, FiAlertCircle } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    // Validate email
    if (!email || !email.includes('@')) {
      setLoginError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    
    // Validate password
    if (!password || password.length < 8) {
      setLoginError("Password must be at least 8 characters.");
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, show an error message
      setLoginError("Invalid email or password. Please try again.");
      
      // In a real application, you would authenticate with your backend
      // and redirect on success
      // if (success) {
      //   router.push('/dashboard');
      // }
    }, 1500);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {loginError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center text-sm mb-4">
          <FiAlertCircle className="mr-2 h-4 w-4" />
          {loginError}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <FiMail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="email"
            type="email"
            placeholder="corporate@example.com" 
            className="pl-10" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <FiLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="password"
            type="password" 
            placeholder="••••••••" 
            className="pl-10" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="rememberMe" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <Label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
          >
            Remember me
          </Label>
        </div>
        
        <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
          Forgot password?
        </a>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
      
      <div className="text-center text-sm text-gray-600">
        <p>Don't have an account?{" "}
          <a href="#" className="font-medium text-gray-900 hover:underline">
            Contact sales
          </a>
        </p>
      </div>
    </form>
  );
} 