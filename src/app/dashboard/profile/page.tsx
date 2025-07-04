"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiUser, FiEdit, FiBook, FiMapPin, FiPhone, FiMail, FiHome } from "react-icons/fi";
import ProfileImageUpload from "@/components/ProfileImageUpload";

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
    percentage: number;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get tokens from localStorage
        const storedTokens = localStorage.getItem('tokens');
        if (!storedTokens) {
          throw new Error("Authentication tokens not found");
        }
        
        const { accessToken } = JSON.parse(storedTokens);
        
        // Call the profile API
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
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

        // Store user profile data
        setUserProfile(data.data.user);
        
        // Update user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.data.user));
      } catch (error) {
        console.error("Profile fetch error:", error);
        
        // Check if the error message indicates authentication issues
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch profile";
        
        if (errorMessage.toLowerCase().includes('token') || 
            errorMessage.toLowerCase().includes('auth') || 
            errorMessage === "Not authorized, token failed") {
          
          // Clear localStorage and redirect to login
          localStorage.removeItem('user');
          localStorage.removeItem('tokens');
          router.push('/login');
          return;
        }
        
        setError(errorMessage);
        
        // Check if we have user data in localStorage as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUserProfile(parsedUser);
          } catch (e) {
            console.error("Error parsing stored user data:", e);
            // Redirect to login if no valid user data is found
            router.push('/login');
          }
        } else {
          // Redirect to login if no user data is found
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Handle successful profile image upload
  const handleProfileImageUploadSuccess = (imageData: { url: string; cloudinaryId: string }) => {
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        profileImage: {
          url: imageData.url,
          cloudinaryId: imageData.cloudinaryId
        }
      };
      setUserProfile(updatedProfile);
      
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(updatedProfile));
    }
  };

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">View and manage your personal information</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white">
            <span className="font-semibold text-gray-900">Batch ID:</span>
            <span className="ml-2 text-pink-600 font-mono">{userProfile?.batchId || "N/A"}</span>
          </div>
        </div>
      </div>
      
      {/* Profile Image Upload */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Profile Photo</h2>
        </div>
        <div className="flex justify-center">
          <div className="max-w-md w-full">
            <ProfileImageUpload 
              currentImageUrl={userProfile?.profileImage?.url} 
              onUploadSuccess={handleProfileImageUploadSuccess}
            />
          </div>
        </div>
      </div>
      
      {/* Profile Information */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="mt-1 text-base font-medium text-gray-900">
                {userProfile?.fullName || `${userProfile?.firstName} ${userProfile?.lastName}`}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
              <p className="mt-1 text-base text-gray-900 flex items-center">
                <FiMail className="mr-1.5 h-4 w-4 text-gray-400" />
                {userProfile?.email || "Not provided"}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
              <p className="mt-1 text-base text-gray-900 flex items-center">
                <FiPhone className="mr-1.5 h-4 w-4 text-gray-400" />
                {userProfile?.phoneNumber || "Not provided"}
              </p>
            </div>
            
            {userProfile?.fatherName && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Father's Name</h3>
                <p className="mt-1 text-base text-gray-900">
                  {userProfile.fatherName}
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {userProfile?.institution && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Institution</h3>
                <p className="mt-1 text-base text-gray-900 flex items-center">
                  <FiHome className="mr-1.5 h-4 w-4 text-gray-400" />
                  {userProfile.institution}
                </p>
              </div>
            )}
            
            {userProfile?.department && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Department</h3>
                <p className="mt-1 text-base text-gray-900 flex items-center">
                  <FiBook className="mr-1.5 h-4 w-4 text-gray-400" />
                  {userProfile.department}
                </p>
              </div>
            )}
            
            {userProfile?.rollNumber && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Roll Number</h3>
                <p className="mt-1 text-base text-gray-900">
                  {userProfile.rollNumber}
                </p>
              </div>
            )}
            
            {userProfile?.semester !== undefined && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Semester</h3>
                <p className="mt-1 text-base text-gray-900">
                  {userProfile.semester}
                </p>
              </div>
            )}
            
            {userProfile?.address && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1 text-base text-gray-900 flex items-start">
                  <FiMapPin className="mr-1.5 h-4 w-4 text-gray-400 mt-1" />
                  <span>
                    {userProfile.address.street && `${userProfile.address.street}, `}
                    {userProfile.address.city && `${userProfile.address.city}, `}
                    {userProfile.address.state && `${userProfile.address.state}, `}
                    {userProfile.address.pincode && userProfile.address.pincode}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 