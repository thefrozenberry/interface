// Payment API utilities for Next.js frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://swrzee.in';

export interface Payment {
  _id: string;
  userId: string;
  batchId: string;
  merchantOrderId: string;
  phonepeOrderId?: string;
  amount: number;
  transactionId?: string;
  paymentMethod: string;
  status: 'pending' | 'success' | 'failed' | 'rejected';
  receiptUrl?: string;
  receiptCloudinaryId?: string;
  webhookResponse?: any;
  paymentDate?: Date;
  failureReason?: string;
  paymentGatewayData?: any;
  remarks?: string;
  description?: string;
  approvedBy?: string;
  metadata?: { [key: string]: any };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentWithDetails {
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
  paymentDate?: Date;
  failureReason?: string;
  paymentGatewayData?: any;
  remarks?: string;
  description?: string;
  approvedBy?: string;
  metadata?: { [key: string]: any };
  createdAt: string;
  updatedAt: string;
}

// Get user's access token from localStorage - matches the project's auth system
const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const storedTokens = localStorage.getItem('tokens');
      if (storedTokens) {
        const { accessToken } = JSON.parse(storedTokens);
        return accessToken || null;
      }
    } catch (error) {
      console.error('Error parsing tokens from localStorage:', error);
    }
  }
  return null;
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAccessToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Get all payments for the current user
export const getUserPayments = async (): Promise<PaymentWithDetails[]> => {
  const token = getAccessToken();
  if (!token) throw new Error('No access token found');
  
  // Decode JWT to get user ID (you might want to store this separately)
  const payload = JSON.parse(atob(token.split('.')[1]));
  const userId = payload.userId;
  
  const response = await apiRequest(`/payments/user/${userId}`);
  return response.data;
};

// Get specific payment by ID
export const getPaymentById = async (paymentId: string): Promise<PaymentWithDetails> => {
  const response = await apiRequest(`/payments/${paymentId}`);
  return response.data;
};

// Get payment receipt URL
export const getPaymentReceiptUrl = async (paymentId: string): Promise<string> => {
  const response = await apiRequest(`/payments/${paymentId}/receipt`);
  return response.data.receiptUrl;
};

// Get payment receipt file (for direct viewing/download)
export const getPaymentReceiptFile = async (paymentId: string): Promise<Blob> => {
  const token = getAccessToken();
  if (!token) throw new Error('No access token found');
  
  const response = await fetch(`${API_BASE_URL}/api/payments/${paymentId}/receipt/file`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.blob();
};

// Verify payment status
export const verifyPayment = async (merchantOrderId: string): Promise<any> => {
  const response = await apiRequest('/payments/verify', {
    method: 'POST',
    body: JSON.stringify({ merchantOrderId }),
  });
  return response;
};

// Download receipt as file
export const downloadReceipt = async (paymentId: string, filename?: string) => {
  try {
    const blob = await getPaymentReceiptFile(paymentId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `receipt_${paymentId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading receipt:', error);
    throw error;
  }
};

// Open receipt in new tab
export const openReceiptInNewTab = async (paymentId: string) => {
  try {
    const blob = await getPaymentReceiptFile(paymentId);
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Clean up the URL after a delay
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error('Error opening receipt:', error);
    throw error;
  }
}; 