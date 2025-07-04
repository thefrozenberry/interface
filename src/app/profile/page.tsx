"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMapPin, FiPhone, FiMail, FiBook, FiHome, FiCheck } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Form state
interface FormDataType {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  rollNumber: string;
  semester: string;
  institution: string;
  fatherName: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  consentStatus: boolean;
  [key: string]: any; // Index signature to allow string indexing
}

export default function ProfileCompletionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  
  // Form state with proper typing
  const [formData, setFormData] = useState<FormDataType>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    department: "",
    rollNumber: "",
    semester: "",
    institution: "",
    fatherName: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    consentStatus: false
  });

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      // Get user data from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          
          // Pre-fill form with available user data
          setFormData(prev => ({
            ...prev,
            firstName: parsedUser.firstName || "",
            lastName: parsedUser.lastName || "",
            email: parsedUser.email || "",
            phoneNumber: parsedUser.phoneNumber || ""
          }));
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      } else {
        // Redirect to login if no user data is found
        router.push('/login');
      }
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields (address)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      // Handle top-level fields
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      consentStatus: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get tokens from localStorage
      const storedTokens = localStorage.getItem('tokens');
      if (!storedTokens) {
        throw new Error("Authentication tokens not found");
      }
      
      const { accessToken } = JSON.parse(storedTokens);
      
      // Convert semester to number
      const formDataToSend = {
        ...formData,
        semester: parseInt(formData.semester, 10)
      };
      
      // Call the complete profile API
      const response = await fetch(`${API_BASE_URL}/api/auth/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(formDataToSend)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to complete profile");
      }

      // Update user data in localStorage with profileComplete = true
      if (userData) {
        localStorage.setItem('user', JSON.stringify({
          ...userData,
          profileComplete: true
        }));
      }

      // Redirect to dashboard after successful profile completion
      router.push('/dashboard');
    } catch (error) {
      console.error("Profile completion error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to complete profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
            <p className="text-gray-500 mt-2">
              Please provide the following information to complete your profile
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                <FiUser className="mr-2 h-5 w-5 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                  <Input 
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    required
                    disabled={!!userData?.firstName}
                    readOnly={!!userData?.firstName}
                  />
                  {userData?.firstName && (
                    <p className="text-xs text-gray-500 mt-1">This field is pre-filled and cannot be edited</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                  <Input 
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    required
                    disabled={!!userData?.lastName}
                    readOnly={!!userData?.lastName}
                  />
                  {userData?.lastName && (
                    <p className="text-xs text-gray-500 mt-1">This field is pre-filled and cannot be edited</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    required
                    disabled={!!userData?.email}
                    readOnly={!!userData?.email}
                  />
                  {userData?.email && (
                    <p className="text-xs text-gray-500 mt-1">This field is pre-filled and cannot be edited</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-gray-700">Phone Number</Label>
                  <Input 
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    required
                    disabled={!!userData?.phoneNumber}
                    readOnly={!!userData?.phoneNumber}
                  />
                  {userData?.phoneNumber && (
                    <p className="text-xs text-gray-500 mt-1">This field is pre-filled and cannot be edited</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherName" className="text-gray-700">Father's Name</Label>
                  <Input 
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Education Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                <FiBook className="mr-2 h-5 w-5 text-blue-600" />
                Education Information
              </h3>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="institution" className="text-gray-700">Institution</Label>
                  <Input 
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="Your university or college"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-700">Department</Label>
                  <Input 
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Computer Science"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rollNumber" className="text-gray-700">Roll Number</Label>
                  <Input 
                    id="rollNumber"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="semester" className="text-gray-700">Semester</Label>
                  <select 
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                <FiHome className="mr-2 h-5 w-5 text-blue-600" />
                Address
              </h3>
              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="street" className="text-gray-700">Street Address</Label>
                  <Input 
                    id="street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    required
                  />
                </div>
                
                <div className="grid gap-5 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-gray-700">City</Label>
                    <Input 
                      id="city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-gray-700">State</Label>
                    <Input 
                      id="state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-gray-700">PIN Code</Label>
                    <Input 
                      id="pincode"
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleInputChange}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Consent */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-start space-x-3 mb-6">
                <Checkbox 
                  id="consent" 
                  checked={formData.consentStatus}
                  onCheckedChange={handleCheckboxChange}
                  required
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="consent"
                    className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the terms and conditions
                  </label>
                  <p className="text-sm text-gray-500">
                    By checking this box, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Complete Profile"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
