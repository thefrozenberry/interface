"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiRefreshCw, FiDownload, FiArrowLeft } from "react-icons/fi";
import PaymentReceipt from "@/components/PaymentReceipt";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://swrzee.ondust.com/api';

interface PaymentStatus {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  batchId: {
    _id: string;
    name: string;
    startDate?: string;
    endDate?: string;
  };
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
  createdAt: string;
  updatedAt: string;
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

  useEffect(() => {
    if (paymentId) {
      checkPaymentStatus(paymentId);
    } else {
      setError("Payment ID is required to check status");
      setIsLoading(false);
    }
  }, [paymentId]);

  const checkPaymentStatus = async (paymentId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Checking payment status for ID:', paymentId);
      console.log('API URL:', `${API_BASE_URL}/payments/${paymentId}`);

      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col items-center text-center">
            {getStatusIcon(paymentStatus.status)}
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              {getStatusMessage(paymentStatus.status)}
            </h1>
            <p className="mt-2 text-gray-600">
              Payment ID: {paymentStatus._id}
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

        {/* User and Batch Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">User & Batch Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* User Information */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">User Details</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-medium text-gray-900">{paymentStatus.userId.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium text-gray-900">{paymentStatus.userId.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phone:</span>
                  <p className="font-medium text-gray-900">{paymentStatus.userId.phone ? paymentStatus.userId.phone : 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            {/* Batch Information */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Batch Details</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Batch Name:</span>
                  <p className="font-medium text-gray-900">{paymentStatus.batchId.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Duration:</span>
                  <p className="font-medium text-gray-900">
                    {paymentStatus.batchId.startDate && paymentStatus.batchId.endDate 
                      ? `${new Date(paymentStatus.batchId.startDate).toLocaleDateString()} - ${new Date(paymentStatus.batchId.endDate).toLocaleDateString()}`
                      : 'Duration not specified'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {paymentStatus.status === 'success' && paymentStatus.receiptUrl && (
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Download Receipt
              </button>
            )}
            
            {paymentStatus.status === 'success' && (
              <button
                onClick={() => setShowReceipt(true)}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiCheckCircle className="w-4 h-4 mr-2" />
                View Receipt
              </button>
            )}
            
            <button
              onClick={handleGoToDashboard}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Go to Dashboard
            </button>
          </div>
          
          {paymentStatus.status === 'failed' || paymentStatus.status === 'rejected' ? (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                Your payment was not successful. Please try again or contact support if the issue persists.
              </p>
            </div>
          ) : paymentStatus.status === 'pending' ? (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                Your payment is being processed. Please wait a few minutes and refresh this page to check the updated status.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Payment Receipt Modal */}
      {showReceipt && paymentStatus && (
        <PaymentReceipt
          paymentId={paymentStatus._id}
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