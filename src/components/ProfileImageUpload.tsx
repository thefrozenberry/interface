import React, { useState } from 'react';
import axios from 'axios';
import { getCloudinaryUploadUrl, cloudinaryConfig } from '@/lib/utils';
import { FiUser, FiUpload, FiCheck, FiX } from 'react-icons/fi';
import Image from 'next/image';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onUploadSuccess?: (imageData: { url: string; cloudinaryId: string }) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImageUrl,
  onUploadSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload to Cloudinary directly
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('folder', cloudinaryConfig.folder);

    try {
      const response = await axios.post(getCloudinaryUploadUrl(), formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(progress);
        },
      });

      return {
        url: response.data.secure_url,
        cloudinaryId: response.data.public_id,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  };

  // Save to backend
  const saveToBackend = async (imageUrl: string, cloudinaryId: string) => {
    try {
      // Get tokens from localStorage
      const storedTokens = localStorage.getItem('tokens');
      if (!storedTokens) {
        throw new Error("Authentication tokens not found");
      }
      
      const { accessToken } = JSON.parse(storedTokens);
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      
      const response = await axios.put(
        `${API_BASE_URL}/users/profile/image`,
        { imageUrl, cloudinaryId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Backend save error:', error);
      throw new Error('Failed to save image URL to backend');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setUploadProgress(0);

    try {
      // 1. Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(selectedFile);
      
      // 2. Save URL to backend
      await saveToBackend(cloudinaryResult.url, cloudinaryResult.cloudinaryId);
      
      // 3. Call success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(cloudinaryResult);
      }
      
      setUploadSuccess(true);
      
      // Reset file selection
      setSelectedFile(null);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      setUploadError((error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 text-center">Your photo will be used on your profile and throughout the platform.</p>
      
      {preview && (
        <div className="flex justify-center">
          <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
            <img 
              src={preview} 
              alt="Profile Preview" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
      
      {!preview && currentImageUrl && (
        <div className="flex justify-center">
          <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
            <Image 
              src={currentImageUrl} 
              alt="Current Profile" 
              width={128} 
              height={128}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
      
      {!preview && !currentImageUrl && (
        <div className="flex justify-center">
          <div className="h-32 w-32 rounded-full overflow-hidden bg-blue-50 border-2 border-gray-200 flex items-center justify-center">
            <FiUser className="h-16 w-16 text-blue-300" />
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center">
          <label htmlFor="profile-image" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <FiUpload className="mr-2 -ml-1 h-4 w-4" />
            Select Image
            <input
              type="file"
              id="profile-image"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
        
        {selectedFile && (
          <div className="flex justify-center">
            <button 
              type="submit" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2 -ml-1 h-4 w-4" />
                  Upload Photo
                </>
              )}
            </button>
          </div>
        )}
        
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-xs text-center mt-1 text-gray-500">{uploadProgress}%</p>
          </div>
        )}
        
        {uploadError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiX className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{uploadError}</p>
              </div>
            </div>
          </div>
        )}
        
        {uploadSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiCheck className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">Profile photo updated successfully!</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileImageUpload; 