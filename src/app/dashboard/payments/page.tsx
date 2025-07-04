'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PaymentForm } from "./payment-form";
import { FiArrowLeft, FiShield, FiCreditCard, FiClock, FiCheckCircle, FiXCircle, FiEye, FiDownload, FiRefreshCw } from "react-icons/fi";
import { getUserPayments, PaymentWithDetails } from "@/lib/services/paymentUtils";
import PaymentReceipt from "@/components/PaymentReceipt";

export default function PaymentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchPayments();
    }
  }, [activeTab]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const paymentData = await getUserPayments();
      setPayments(paymentData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payments';
      setError(errorMessage);
      
      // Check if it's an authentication error and redirect to login
      if (errorMessage.toLowerCase().includes('token') || 
          errorMessage.toLowerCase().includes('auth') || 
          errorMessage === 'No access token found') {
        
        // Clear localStorage and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
        router.push('/login');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <FiCheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <FiClock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
      case 'rejected':
        return <FiXCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FiClock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'failed':
      case 'rejected':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1">
            Manage your payments and view payment history.
          </p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('form')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'form'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FiCreditCard className="inline-block w-4 h-4 mr-2" />
            Payment Status
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FiClock className="inline-block w-4 h-4 mr-2" />
            Payment History
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'form' && (
        <div className="bg-white border border-gray-100 rounded-xl p-8">
            <PaymentForm />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Header with refresh button */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
            <button
              onClick={fetchPayments}
              disabled={loading}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <FiRefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <FiXCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  {error.toLowerCase().includes('token') || error.toLowerCase().includes('auth') ? (
                    <button
                      onClick={() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('tokens');
                        router.push('/login');
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Click here to log in again
                    </button>
                  ) : null}
              </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading payments...</span>
            </div>
          )}

          {/* Payment List */}
          {!loading && !error && (
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              {payments.length === 0 ? (
                <div className="text-center py-12">
                  <FiCreditCard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't made any payments yet.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('form')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Make Your First Payment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {payment.batchId.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Order: {payment.merchantOrderId}
                              </div>
                              {payment.transactionId && (
                                <div className="text-sm text-gray-500">
                                  TXN: {payment.transactionId}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatAmount(payment.amount)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.paymentMethod}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(payment.status)}
                              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(payment.status)}`}>
                                {payment.status.toUpperCase()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(payment.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setSelectedPayment(payment._id)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <FiEye className="h-4 w-4" />
                            </button>
                            {payment.status === 'success' && (
                              <button
                                onClick={() => {
                                  // Handle download receipt
                                  console.log('Download receipt for:', payment._id);
                                }}
                                className="text-green-600 hover:text-green-900"
                              >
                                <FiDownload className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Payment Receipt Modal */}
      {selectedPayment && (
        <PaymentReceipt
          paymentId={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
} 