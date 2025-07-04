"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FiCheck, FiAlertCircle, FiCreditCard, FiShield, FiArrowRight } from "react-icons/fi";

export function PaymentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<boolean | null>(null);
  const [batchId, setBatchId] = useState<string | null>(null);
  
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get tokens from localStorage
      const storedTokens = localStorage.getItem('tokens');
      if (!storedTokens) {
        throw new Error("Authentication tokens not found");
      }
      
      const { accessToken } = JSON.parse(storedTokens);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      
      // Call the profile API
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if the error is related to token authentication
        if (data.message?.toLowerCase().includes('token') || 
            data.message?.toLowerCase().includes('auth') ||
            data.message === "Not authorized, token failed" ||
            response.status === 401 || 
            response.status === 403) {
          
          // Clear localStorage and redirect to login
          localStorage.removeItem('user');
          localStorage.removeItem('tokens');
          router.push('/login');
          return;
        }
        
        throw new Error(data.message || "Failed to fetch profile");
      }

      // Set payment status and batchId from the API response
      setPaymentStatus(data.data.user.paymentStatus);
      setBatchId(data.data.user.batchId);
      
    } catch (error) {
      console.error("Profile fetch error:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch profile";
      setError(errorMessage);
      
      // Check if we have user data in localStorage as fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setPaymentStatus(parsedUser.paymentStatus);
          setBatchId(parsedUser.batchId);
        } catch (e) {
          console.error("Error parsing stored user data:", e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading payment status...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <FiAlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Payment Status Section */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiCreditCard className="mr-2 h-5 w-5 text-blue-600" />
            Payment Status
          </h3>
        </div>
        
        {paymentStatus ? (
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
              <FiCheck className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Payment Approved</h4>
            <p className="text-gray-600 mb-6">
              Your course fee has been successfully paid. You now have full access to the portal and can start your learning journey.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
              <FiShield className="h-4 w-4 mr-2" />
              Payment Complete
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-200">
              <FiAlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Payment Required</h4>
            <p className="text-gray-600 mb-6">
              Complete your payment to unlock full access to the course.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              <FiCreditCard className="h-4 w-4 mr-2" />
              Payment Pending
            </div>
          </div>
        )}
      </div>

      {/* Action Section */}
      {!paymentStatus && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Your Payment</h3>
          <p className="text-gray-600 mb-6">
            {!batchId 
              ? "You must be assigned to a batch before you can make payment. Please wait for your batch assignment."
              : "Go to the dashboard and click on the payment button to complete your payment."
            }
          </p>
          
          <Button 
            onClick={handleGoToDashboard}
            disabled={!batchId}
            className={`w-full px-6 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
              batchId 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center">
              <FiArrowRight className="h-5 w-5 mr-2" />
              {batchId ? 'Go to Dashboard' : 'Payment Disabled - No Batch Assigned'}
            </div>
          </Button>
        </div>
      )}
    </div>
  );
} 