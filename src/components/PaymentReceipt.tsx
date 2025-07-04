'use client';

import React, { useState, useEffect } from 'react';
import { 
  getPaymentById, 
  downloadReceipt, 
  openReceiptInNewTab,
  PaymentWithDetails 
} from '@/lib/services/paymentUtils';

interface PaymentReceiptProps {
  paymentId: string;
  onClose?: () => void;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ paymentId, onClose }) => {
  const [payment, setPayment] = useState<PaymentWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [viewing, setViewing] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const paymentData = await getPaymentById(paymentId);
        setPayment(paymentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch payment details');
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadReceipt(paymentId, `receipt_${payment?.merchantOrderId || paymentId}.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download receipt');
    } finally {
      setDownloading(false);
    }
  };

  const handleView = async () => {
    try {
      setViewing(true);
      await openReceiptInNewTab(paymentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open receipt');
    } finally {
      setViewing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading payment details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Not Found</h3>
            <p className="text-gray-600 mb-4">The requested payment could not be found.</p>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Payment Receipt</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Payment Status */}
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
              {payment.status.toUpperCase()}
            </span>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Payment ID:</span>
                  <p className="text-sm text-gray-900">{payment._id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Order ID:</span>
                  <p className="text-sm text-gray-900">{payment.merchantOrderId}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Transaction ID:</span>
                  <p className="text-sm text-gray-900">{payment.transactionId || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Amount:</span>
                  <p className="text-lg font-semibold text-green-600">{formatAmount(payment.amount)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Payment Method:</span>
                  <p className="text-sm text-gray-900">{payment.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Payment Date:</span>
                  <p className="text-sm text-gray-900">
                    {payment.paymentDate ? formatDate(payment.paymentDate) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name:</span>
                  <p className="text-sm text-gray-900">{payment.userId.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-sm text-gray-900">{payment.userId.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Phone:</span>
                  <p className="text-sm text-gray-900">{payment.userId.phone || 'N/A'}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Batch Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Batch Name:</span>
                  <p className="text-sm text-gray-900">{payment.batchId.name}</p>
                </div>
                {payment.batchId.startDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Start Date:</span>
                    <p className="text-sm text-gray-900">{formatDate(payment.batchId.startDate)}</p>
                  </div>
                )}
                {payment.batchId.endDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">End Date:</span>
                    <p className="text-sm text-gray-900">{formatDate(payment.batchId.endDate)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {payment.description && (
            <div className="mb-6">
              <span className="text-sm font-medium text-gray-500">Description:</span>
              <p className="text-sm text-gray-900 mt-1">{payment.description}</p>
            </div>
          )}

          {/* Failure Reason */}
          {payment.failureReason && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-sm font-medium text-red-800">Failure Reason:</span>
              <p className="text-sm text-red-700 mt-1">{payment.failureReason}</p>
            </div>
          )}

          {/* Action Buttons */}
          {payment.status === 'success' && (
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <button
                onClick={handleView}
                disabled={viewing}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {viewing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Opening...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Receipt
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Receipt
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt; 