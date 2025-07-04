"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiRefreshCw, FiDownload, FiArrowLeft } from "react-icons/fi";
import PaymentReceipt from "@/components/PaymentReceipt";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://swrzee.in';

interface PaymentStatus {
  paymentId: string;
  merchantOrderId: string;
  phonepeOrderId?: string;
  amount: number;
  transactionId?: string;
  paymentMethod: string;
  status: 'pending' | 'success' | 'failed' | 'rejected';
  receiptUrl?: string;
  receiptCloudinaryId?: string;
  webhookResponse?: any;
  paymentDate?: string;
  failureReason?: string;
  paymentGatewayData?: any;
  remarks?: string;
  description?: string;
  approvedBy?: string;
  metadata?: { [key: string]: any };
  user?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  batch?: {
    _id: string;
    name: string;
    startDate?: string;
    endDate?: string;
  };
}

function CheckStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const merchantOrderId = searchParams.get('merchantOrderId');
  const paymentId = searchParams.get('paymentId');
  const orderId = searchParams.get('orderId');
  const urlError = searchParams.get('error');

  useEffect(() => {
    // Handle URL error first
    if (urlError) {
      setError("Payment not found. Please check your payment link and try again.");
      setIsLoading(false);
      return;
    }

    if (paymentId) {
      checkPaymentStatus(paymentId);
    } else if (merchantOrderId) {
      checkPaymentStatusByOrderId(merchantOrderId);
    } else if (orderId) {
      checkPaymentStatusByOrderId(orderId);
    } else {
      // Try to get payment ID from localStorage (fallback for PhonePe redirects)
      const storedPaymentId = localStorage.getItem('pendingPaymentId');
      if (storedPaymentId) {
        checkPaymentStatus(storedPaymentId);
        // Clear the stored payment ID after using it
        localStorage.removeItem('pendingPaymentId');
      } else {
        setError("Payment ID is required to check status. Please ensure you have a valid payment link.");
        setIsLoading(false);
      }
    }
  }, [paymentId, merchantOrderId, orderId, urlError]);

  // Countdown and redirect effect
  useEffect(() => {
    if (paymentStatus && !isLoading && !error) {
      let countdown = 5;
      const countdownElement = document.getElementById('countdown');
      const progressBar = document.getElementById('progress-bar');
      
      const timer = setInterval(() => {
        countdown--;
        
        if (countdownElement) {
          countdownElement.textContent = countdown.toString();
        }
        
        if (progressBar) {
          const progress = (countdown / 5) * 100;
          progressBar.style.width = `${progress}%`;
        }
        
        if (countdown <= 0) {
          clearInterval(timer);
          router.push('/dashboard');
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [paymentStatus, isLoading, error, router]);

  const checkPaymentStatus = async (paymentId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Checking payment status for ID:', paymentId);
      console.log('API URL:', `${API_BASE_URL}/api/payments/status/${paymentId}`);

      // Get tokens from localStorage
      const storedTokens = localStorage.getItem('tokens');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if token exists
      if (storedTokens) {
        try {
          const { accessToken } = JSON.parse(storedTokens);
          if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
          }
        } catch (e) {
          console.warn('Error parsing stored tokens:', e);
        }
      }

      const response = await fetch(`${API_BASE_URL}/payments/status/${paymentId}`, {
        method: 'GET',
        headers,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Handle non-JSON response
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      if (data.success) {
        setPaymentStatus(data.data);
      } else {
        throw new Error(data.message || 'Payment status check failed');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      
      // Handle different types of errors
      if (error instanceof SyntaxError) {
        setError('Invalid response from server. Please try again later.');
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to check payment status');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatusByOrderId = async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Checking payment status for Order ID:', orderId);
      console.log('API URL:', `${API_BASE_URL}/api/payments/status/order/${orderId}`);

      // Get tokens from localStorage
      const storedTokens = localStorage.getItem('tokens');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if token exists
      if (storedTokens) {
        try {
          const { accessToken } = JSON.parse(storedTokens);
          if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
          }
        } catch (e) {
          console.warn('Error parsing stored tokens:', e);
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/payments/status/order/${orderId}`, {
        method: 'GET',
        headers,
      });

      console.log('Response status:', response.status);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Handle non-JSON response
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      if (data.success) {
        setPaymentStatus(data.data);
      } else {
        throw new Error(data.message || 'Payment status check failed');
      }
    } catch (error) {
      console.error('Error checking payment status by order ID:', error);
      
      // Handle different types of errors
      if (error instanceof SyntaxError) {
        setError('Invalid response from server. Please try again later.');
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to check payment status');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <FiCheckCircle className="h-12 w-12 text-green-500" />;
      case 'pending':
        return <FiClock className="h-12 w-12 text-yellow-500" />;
      case 'failed':
      case 'rejected':
        return <FiXCircle className="h-12 w-12 text-red-500" />;
      default:
        return <FiAlertCircle className="h-12 w-12 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'failed':
      case 'rejected':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'success':
        return 'Payment Successful';
      case 'pending':
        return 'Payment Pending';
      case 'failed':
        return 'Payment Failed';
      case 'rejected':
        return 'Payment Rejected';
      default:
        return 'Unknown Status';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRetry = () => {
    if (paymentId) {
      checkPaymentStatus(paymentId);
    } else if (merchantOrderId) {
      checkPaymentStatusByOrderId(merchantOrderId);
    } else if (orderId) {
      checkPaymentStatusByOrderId(orderId);
    } else {
      // Try localStorage fallback
      const storedPaymentId = localStorage.getItem('pendingPaymentId');
      if (storedPaymentId) {
        checkPaymentStatus(storedPaymentId);
      }
    }
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleDownloadReceipt = () => {
    if (paymentStatus?.receiptUrl) {
      window.open(paymentStatus.receiptUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Checking Payment Status</h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Please wait while we verify your payment...
            </p>
            {(paymentId || merchantOrderId || orderId) && (
              <p className="mt-2 text-xs text-gray-500 text-center">
                {paymentId && `Payment ID: ${paymentId}`}
                {merchantOrderId && `Order ID: ${merchantOrderId}`}
                {orderId && `Order ID: ${orderId}`}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <FiAlertCircle className="h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Error</h2>
            <p className="mt-2 text-sm text-gray-600 text-center">{error}</p>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiRefreshCw className="inline-block w-4 h-4 mr-2" />
                Retry
              </button>
              <button
                onClick={handleGoToDashboard}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <FiArrowLeft className="inline-block w-4 h-4 mr-2" />
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <FiAlertCircle className="h-12 w-12 text-gray-500" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No Payment Found</h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              We couldn't find any payment with the provided ID.
            </p>
            <button
              onClick={handleGoToDashboard}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiArrowLeft className="inline-block w-4 h-4 mr-2" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col items-center text-center">
            {getStatusIcon(paymentStatus.status)}
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              {getStatusMessage(paymentStatus.status)}
            </h1>
            <p className="mt-2 text-gray-600">
              Payment ID: {paymentStatus.paymentId}
            </p>
            <span className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(paymentStatus.status)}`}>
              {paymentStatus.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Amount</span>
              <span className="font-semibold text-gray-900">{formatAmount(paymentStatus.amount)}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900 capitalize">{paymentStatus.paymentMethod}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Order ID</span>
              <span className="font-mono text-sm text-gray-900">{paymentStatus.merchantOrderId}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Payment Date</span>
              <span className="text-gray-900">{paymentStatus.paymentDate ? formatDate(paymentStatus.paymentDate) : 'Not available'}</span>
            </div>
            
            {paymentStatus.failureReason && (
              <div className="flex justify-between items-start py-3 border-b border-gray-100">
                <span className="text-gray-600">Failure Reason</span>
                <span className="text-red-600 text-sm max-w-xs text-right">{paymentStatus.failureReason}</span>
              </div>
            )}
          </div>
        </div>

        {/* Redirect Animation */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Redirecting to Dashboard</h3>
            <p className="text-sm text-gray-600 mb-4">You will be redirected in <span className="font-semibold text-blue-600" id="countdown">5</span> seconds</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-linear" id="progress-bar" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Receipt Modal */}
      {showReceipt && paymentStatus && (
        <PaymentReceipt
          paymentId={paymentStatus.paymentId}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}

// Loading fallback component
function CheckStatusLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Loading...</h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Please wait while we load the payment status page...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckStatusPage() {
  return (
    <Suspense fallback={<CheckStatusLoading />}>
      <CheckStatusContent />
    </Suspense>
  );
} 