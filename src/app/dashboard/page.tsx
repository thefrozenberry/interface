"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiCreditCard, FiChevronRight, FiClock, FiCheckCircle, FiUpload, FiActivity, FiCalendar, FiBook, FiCheck, FiX, FiDollarSign } from "react-icons/fi";
import ScanOnline from "@/components/ScanOnline";
import CameraCapture from "@/components/CameraCapture";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface UserProfile {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  batchId: string;
  profileImage: {
    url: string;
    cloudinaryId: string;
  };
  department: string;
  rollNumber: string;
  semester: number;
  institution: string;
  fatherName: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentStatus: boolean;
  activeStatus: boolean;
  courseCreditScore: number;
  grade: string;
  role: string;
  profileComplete: boolean;
  attendanceStats: {
    present: number;
    absent: number;
    late: number;
    halfDay: number;
    percentage: number;
    recentAttendance: Array<{
      _id: string;
      date: string;
      status: 'present' | 'absent' | 'late' | 'half-day';
      batchInfo: {
        name: string;
      };
    }>;
    lastUpdated: string;
    debug?: {
      calculatedStats: {
        present: number;
        absent: number;
        late: number;
        halfDay: number;
        total: number;
        effectiveAttendance: number;
        percentage: number;
      };
      storedStats: {
        present: number;
        absent: number;
        late: number;
        halfDay: number;
        percentage: number;
      };
    };
  };
}

interface Course {
  _id: string;
  serviceName: string;
  description: string;
  price: number;
  duration: number;
  unit: string;
  active: boolean;
  imageURL: {
    url: string;
    cloudinaryId: string;
  };
  dropdownOptions?: {
    title: string;
    options: string[];
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface BatchService {
  _id: string;
  serviceName: string;
  description: string;
  price: number;
}

interface Batch {
  _id: string;
  batchId: string;
  programName: string;
  courseCredit: number;
  services: BatchService[];
  duration: string;
  startDate: string;
  endDate: string;
  status: string;
  year: number;
  totalFee: number;
  attendancePolicy: {
    minPercentage: number;
    graceDays: number;
  };
}

interface TokenData {
  accessToken: string;
  refreshToken: string;
}



export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [batchLoading, setBatchLoading] = useState(true);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<'checkin' | 'checkout' | null>(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [showPaymentLink, setShowPaymentLink] = useState(false);
  
  // Function to get a fresh token if needed
  const getValidToken = async (): Promise<string | null> => {
    try {
      const storedTokens = localStorage.getItem('tokens');
      if (!storedTokens) {
        throw new Error("Authentication tokens not found");
      }
      
      const { accessToken, refreshToken } = JSON.parse(storedTokens) as TokenData;
      
      // First try with the existing access token
      return accessToken;
      
      // Note: In a production app, you would implement token refresh logic here
      // if the access token is expired, using the refresh token
      // For now, we'll just use the access token directly
      
    } catch (error) {
      console.error("Token retrieval error:", error);
      return null;
    }
  };
  
  // Function to handle API requests with token
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      const token = await getValidToken();
      
      if (!token) {
        throw new Error("No valid token available");
      }
      
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          ...(options.headers || {})
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle token errors
        if (
          data.message?.toLowerCase().includes('token') || 
          data.message?.toLowerCase().includes('auth') ||
          data.message === "Not authorized, token failed" ||
          response.status === 401 || 
          response.status === 403
        ) {
          // Clear localStorage and redirect to login
          localStorage.removeItem('user');
          localStorage.removeItem('tokens');
          throw new Error("Authentication failed. Please log in again.");
        }
        
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      
      return data;
    } catch (error) {
      if ((error instanceof Error) && 
          (error.message.includes("Authentication failed") || 
           error.message.includes("No valid token"))) {
        router.push('/login');
      }
      throw error;
    }
  };
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch user profile
        const profileData = await fetchWithAuth(`${API_BASE_URL}/api/users/profile`);
        setUserProfile(profileData.data.user);
        
        // Fetch attendance stats from the new API
        const statsData = await fetchWithAuth(`${API_BASE_URL}/api/attendance/stats`);
        console.log('Dashboard attendance stats response:', statsData.data);
        setUserProfile(prev => prev ? { ...prev, attendanceStats: statsData.data } : null);
        
                  // Update user data in localStorage
          localStorage.setItem('user', JSON.stringify(profileData.data.user));
      } catch (error) {
        console.error("Profile fetch error:", error);
        
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch profile";
        setError(errorMessage);
        
        // Check if we have user data in localStorage as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUserProfile(parsedUser);
          } catch (e) {
            console.error("Error parsing stored user data:", e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Fetch active courses
  useEffect(() => {
    const fetchCourses = async () => {
      setCoursesLoading(true);
      setCoursesError(null);
      
      try {
        // Use our fetchWithAuth helper
        const data = await fetchWithAuth(`${API_BASE_URL}/api/services/active?category=Course`);
        
        // Store courses data from the correct response structure
        setCourses(data.data || []);
      } catch (error) {
        console.error("Courses fetch error:", error);
        setCoursesError(error instanceof Error ? error.message : "Failed to fetch courses");
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch batch information
  useEffect(() => {
    const fetchBatch = async () => {
      setBatchLoading(true);
      setBatchError(null);
      
      try {
        // Use our fetchWithAuth helper
        const data = await fetchWithAuth(`${API_BASE_URL}/api/users/batch`);
        
        // Store batch data if available
        if (data.success && data.data.batch) {
          setBatch(data.data.batch);
        } else {
          setBatch(null);
        }
      } catch (error) {
        console.error("Batch fetch error:", error);
        setBatchError(error instanceof Error ? error.message : "Failed to fetch batch information");
      } finally {
        setBatchLoading(false);
      }
    };

    fetchBatch();
  }, []);

  // Handle Check In
  const handleCheckIn = async () => {
    setCameraMode('checkin');
    setShowCamera(true);
  };

  // Handle Check Out
  const handleCheckOut = async () => {
    setCameraMode('checkout');
    setShowCamera(true);
  };

  // Handle photo capture and submission
  const handlePhotoCapture = async (photoData: string) => {
    try {
      // Check if user has a batch assigned
      if (!userProfile?.batchId) {
        alert('You need to be assigned to a batch before you can check in/out. Please contact your administrator.');
        return;
      }

      const endpoint = cameraMode === 'checkin' ? '/api/attendance/check-in' : '/api/attendance/check-out';
      const setIsLoading = cameraMode === 'checkin' ? setIsCheckingIn : setIsCheckingOut;
      
      setIsLoading(true);
      
      // Get device info
      const deviceInfo = `${navigator.platform}, ${navigator.userAgent}`;
      
      // Get location (you might want to add proper location permission handling)
      let location = { latitude: 0, longitude: 0 };
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
          });
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (error) {
          console.warn('Location access denied or failed:', error);
        }
      }

      const requestBody = {
        photo: photoData,
        location,
        deviceInfo,
        batchId: userProfile.batchId // Explicitly include batchId in the request
      };

      console.log('Sending attendance request with batchId:', userProfile.batchId);

      const data = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      // Handle success
      alert(cameraMode === 'checkin' ? 'Check-in successful!' : 'Check-out successful!');
      
      // Refresh attendance data if needed
      // You might want to refetch user profile to update attendance stats
      
    } catch (error) {
      console.error('Attendance submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('Batch not found')) {
        alert('Batch not found. Please contact your administrator to ensure you are properly assigned to a batch.');
      } else {
        alert(`Failed to ${cameraMode === 'checkin' ? 'check in' : 'check out'}. Please try again.`);
      }
    } finally {
      setIsCheckingIn(false);
      setIsCheckingOut(false);
      setShowCamera(false);
      setCameraMode(null);
    }
  };

  // Handle camera close
  const handleCameraClose = () => {
    setShowCamera(false);
    setCameraMode(null);
  };

  // Handle course selection for payment
  const handleCourseSelection = (course: Course) => {
    if (!userProfile?.batchId) {
      // Show batch assignment required message
      alert("You must be assigned to a batch before enrolling in courses. Please wait for your batch assignment.");
      return;
    }
    setSelectedCourse(course);
    setEnrollmentError(null);
  };

  // Handle payment initiation
  const handlePaymentInitiation = async () => {
    if (!selectedCourse || !userProfile) return;

    setEnrollmentLoading(true);
    setEnrollmentError(null);

    try {
      const paymentData = {
        userId: userProfile.userId,
        batchId: userProfile.batchId,
        amount: selectedCourse.price,
        paymentMethod: "phonepe",
        description: "Course fee payment"
      };

      const response = await fetchWithAuth(`${API_BASE_URL}/api/payments/initiate`, {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });

      console.log('Payment initiation response:', response);
      
      // Check if payment was initiated successfully
      if (response.success && response.data?.paymentLink) {
        // Store payment ID for verification later
        localStorage.setItem('pendingPaymentId', response.data.paymentId);
        localStorage.setItem('pendingPaymentCourse', selectedCourse.serviceName);
        
        // Show payment link to user for manual click
        setPaymentLink(response.data.paymentLink);
        setShowPaymentLink(true);
        
      } else {
        throw new Error('Payment link not received');
      }
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      setEnrollmentError(error instanceof Error ? error.message : 'Failed to initiate payment');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Close enrollment modal
  const closeEnrollmentModal = () => {
    setShowEnrollmentModal(false);
    setSelectedCourse(null);
    setEnrollmentError(null);
  };

  // Handle manual payment link click
  const handlePaymentLinkClick = () => {
    if (paymentLink) {
      window.open(paymentLink, '_blank');
      // Close the payment link modal after opening
      setShowPaymentLink(false);
      setPaymentLink(null);
      setShowEnrollmentModal(false);
      setSelectedCourse(null);
    }
  };

  // Close payment link modal
  const closePaymentLinkModal = () => {
    setShowPaymentLink(false);
    setPaymentLink(null);
  };

  // Verify payment
  const verifyPayment = async (merchantOrderId: string) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/payments/verify`, {
        method: 'POST',
        body: JSON.stringify({
          merchantOrderId: merchantOrderId
        })
      });

      console.log('Payment verification response:', response);
      
      if (response.success) {
        // Clear pending payment data
        localStorage.removeItem('pendingPaymentId');
        localStorage.removeItem('pendingPaymentCourse');
        
        // Show success message
        alert('Payment verified successfully! Your enrollment is complete.');
        
        // Optionally refresh user data or redirect
        window.location.reload();
      } else {
        throw new Error(response.message || 'Payment verification failed');
      }
      
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment verification failed. Please contact support.');
    }
  };

  // Check for payment return (called when user returns from payment gateway)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const merchantOrderId = urlParams.get('merchantOrderId');
    const paymentStatus = urlParams.get('paymentStatus');
    
    if (merchantOrderId && paymentStatus === 'SUCCESS') {
      // Verify the payment
      verifyPayment(merchantOrderId);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Auto-select first course when modal opens and courses are loaded
  useEffect(() => {
    if (showEnrollmentModal && courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]);
    }
  }, [showEnrollmentModal, courses, selectedCourse]);

  const handlePaymentClick = () => {
    // Show course selection modal for payment
    setShowEnrollmentModal(true);
    setEnrollmentError(null);
    // Auto-select the first course if available
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]);
    }
  };

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If there's an error and no profile, show error message
  if (error && !userProfile) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <p className="mt-2 text-sm">
              <button 
                onClick={() => router.push('/login')}
                className="text-red-700 underline hover:text-red-600"
              >
                Return to login
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userProfile?.firstName || "User"}</h1>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          {/* Payment Status Section */}
          <div className="flex items-center gap-3">
            {userProfile?.paymentStatus ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                <FiCheck className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Payment Approved</span>
              </div>
            ) : (
              <button
                onClick={handlePaymentClick}
                disabled={!userProfile?.batchId}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium transition-colors ${
                  userProfile?.batchId
                    ? 'text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    : 'text-gray-400 bg-gray-300 cursor-not-allowed'
                }`}
                title={!userProfile?.batchId ? "You must be assigned to a batch before making payment" : ""}
              >
                Pay Course Fee
              </button>
            )}
          </div>
          
          {/* Vertical Border */}
          <div className="hidden md:block w-px h-8 bg-gray-300"></div>
          
          {/* Check In/Out Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={() => handleCheckIn()}
              disabled={isCheckingIn || isCheckingOut || !userProfile?.batchId || !userProfile?.paymentStatus}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                !userProfile?.batchId ? "You need to be assigned to a batch to check in" :
                !userProfile?.paymentStatus ? "You need to complete payment before checking in" :
                ""
              }
            >
              {isCheckingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FiCheckCircle className="mr-2 -ml-1 h-4 w-4" />
                  Check In
                </>
              )}
            </button>
            <button 
              onClick={() => handleCheckOut()}
              disabled={isCheckingIn || isCheckingOut || !userProfile?.batchId || !userProfile?.paymentStatus}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                !userProfile?.batchId ? "You need to be assigned to a batch to check out" :
                !userProfile?.paymentStatus ? "You need to complete payment before checking out" :
                ""
              }
            >
              {isCheckingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FiClock className="mr-2 -ml-1 h-4 w-4" />
                  Check Out
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Warnings Container */}
      {(!userProfile?.batchId || !userProfile?.paymentStatus) && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Notices</h2>
          <div className="space-y-3">
            {!userProfile?.batchId && (
              <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Batch Assignment Required</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You are not assigned to any batch yet. Please wait for your batch to be assigned to you before you can check in/out.
                  </p>
                </div>
              </div>
            )}
            
            {!userProfile?.paymentStatus && (
              <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  <FiX className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Payment Required</h3>
                  <p className="text-sm text-red-700 mt-1">
                    {!userProfile?.batchId 
                      ? "You must be assigned to a batch before you can make payment. Please wait for your batch assignment."
                      : "You must complete your course fee payment before accessing to the portal."
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Attendance Stats Summary */}
      {userProfile?.attendanceStats && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Attendance Overview</h2>
              {userProfile.attendanceStats.lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {new Date(userProfile.attendanceStats.lastUpdated).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              )}
            </div>
            <Link href="/dashboard/attendance" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Details
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm font-medium text-gray-500">Present</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{userProfile.attendanceStats.present}</p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <p className="text-sm font-medium text-gray-500">Absent</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{userProfile.attendanceStats.absent}</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <p className="text-sm font-medium text-gray-500">Late</p>
              <p className="text-2xl font-bold text-yellow-700 mt-1">{userProfile.attendanceStats.late}</p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <p className="text-sm font-medium text-gray-500">Half Day</p>
              <p className="text-2xl font-bold text-orange-700 mt-1">{userProfile.attendanceStats.halfDay}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-sm font-medium text-gray-500">Percentage</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{userProfile.attendanceStats.percentage}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Batch Information Section */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Batch Information</h2>
        </div>
        
        {batchLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : batchError ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700 text-sm">
            Failed to load batch information: {batchError}
          </div>
        ) : !batch ? (
          <div className="text-center py-8 text-gray-500">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">No batch assigned yet.</p>
            <p className="text-sm mt-1">You will be assigned to a batch soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Batch Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{batch.programName}</h3>
                  <p className="text-sm text-gray-600 mt-1">Batch ID: {batch.batchId}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    batch.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                    batch.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Batch Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{batch.duration}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">Course Credits</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{batch.courseCredit}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">Total Fee</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">₹{batch.totalFee}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {new Date(batch.startDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">End Date</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {new Date(batch.endDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">Year</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">{batch.year}</p>
              </div>
            </div>

            {/* Attendance Policy */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-2">Attendance Policy</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Minimum Attendance</p>
                  <p className="font-semibold text-gray-900">{batch.attendancePolicy.minPercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grace Days</p>
                  <p className="font-semibold text-gray-900">{batch.attendancePolicy.graceDays} days</p>
                </div>
              </div>
            </div>

            {/* Services/Courses in Batch */}
            {batch.services && batch.services.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Services in this Batch</h4>
                <div className="space-y-3">
                  {batch.services.map((service) => (
                    <div key={service._id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-gray-900">{service.serviceName}</h5>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        </div>
                        <span className="text-blue-600 font-medium">₹{service.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Courses Section */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Courses</h2>
        </div>
        
        {coursesLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : coursesError ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700 text-sm">
            Failed to load courses: {coursesError}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiBook className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">No courses available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="border border-gray-200 rounded-lg overflow-hidden transition-shadow">
                {course.imageURL && course.imageURL.url && (
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={course.imageURL.url} 
                      alt={course.serviceName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{course.serviceName}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                  
                  {course.dropdownOptions && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">{course.dropdownOptions.title}:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {course.dropdownOptions.options.slice(0, 3).map((option, index) => (
                          <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {option}
                          </span>
                        ))}
                        {course.dropdownOptions.options.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            +{course.dropdownOptions.options.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-blue-600 font-medium">₹{course.price}</span>
                    <span className="text-gray-500 text-sm">{course.duration} {course.unit === 'piece' ? 'days' : course.unit}</span>
                  </div>
                  <Link 
                    href={`/workshops/${course.serviceName.toLowerCase().replace(/\s+/g, '-')}`}
                    className="mt-3 w-full py-2 px-4 rounded-md text-sm font-medium transition-colors transform bg-gray-600 hover:bg-gray-700 text-white hover:scale-105 active:scale-95 flex items-center justify-center"
                  >
                    See more details...
                    <FiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
            
            {/* ScanOnline Component - positioned as a course card */}
            <div className="flex items-center justify-center">
              <ScanOnline />
            </div>
          </div>
        )}
      </div>
      
      {/* Camera Capture Modal */}
      {showCamera && cameraMode && (
        <CameraCapture
          mode={cameraMode}
          onCapture={handlePhotoCapture}
          onClose={handleCameraClose}
        />
      )}

      {/* Course Selection Modal */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={closeEnrollmentModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl max-w-2xl w-full mx-4 transform animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="relative p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Select Course for Payment</h3>
                  <p className="text-sm text-gray-500 mt-1">Choose a course to enroll and pay</p>
                </div>
                <button
                  onClick={closeEnrollmentModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Course Selection */}
            <div className="p-6">
              {coursesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : coursesError ? (
                <div className="bg-red-50 p-4 rounded-md text-red-700 text-sm">
                  Failed to load courses: {coursesError}
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiBook className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">No courses available at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {courses.map((course) => (
                    <div 
                      key={course._id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedCourse?._id === course._id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleCourseSelection(course)}
                    >
                      <div className="flex items-center space-x-4">
                        {course.imageURL && course.imageURL.url && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <img 
                              src={course.imageURL.url} 
                              alt={course.serviceName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{course.serviceName}</h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-bold text-blue-600">₹{course.price}</span>
                            <span className="text-sm text-gray-500">{course.duration} {course.unit === 'piece' ? 'days' : course.unit}</span>
                          </div>
                        </div>
                        {selectedCourse?._id === course._id && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <FiCheck className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}



              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-8 bg-orange-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Method</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Online Payment</p>
                      <p className="text-sm text-gray-500">Fast and secure payment</p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {enrollmentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{enrollmentError}</p>
                </div>
              )}

              {/* Payment Summary */}
              {selectedCourse && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h5 className="font-medium text-gray-900 mb-3">Payment Summary</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Course Fee</span>
                      <span className="font-medium">₹{selectedCourse.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Processing Fee</span>
                      <span className="font-medium">₹0</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="font-semibold text-gray-900">Total Amount</span>
                      <span className="font-bold text-lg text-blue-600">₹{selectedCourse.price}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={closeEnrollmentModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentInitiation}
                  disabled={enrollmentLoading || !selectedCourse}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {enrollmentLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Pay ₹{selectedCourse?.price || 0}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Link Modal */}
      {showPaymentLink && paymentLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={closePaymentLinkModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl max-w-md w-full mx-4 transform animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="relative p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Payment Ready</h3>
                  <p className="text-sm text-gray-500 mt-1">Click below to proceed with payment</p>
                </div>
                <button
                  onClick={closePaymentLinkModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Payment Link Content */}
            <div className="p-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Payment Link Generated</h4>
                    <p className="text-sm text-gray-600">Your payment gateway is ready</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-2">Payment Details:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Course:</span>
                      <span className="font-medium">{selectedCourse?.serviceName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-medium">₹{selectedCourse?.price || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method:</span>
                      <span className="font-medium">PhonePe</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePaymentLinkClick}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Proceed to Payment</span>
                </button>

                <p className="text-xs text-gray-500 text-center">
                  You will be redirected to PhonePe payment gateway
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 