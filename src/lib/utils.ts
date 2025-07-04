import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: 'dojodcwxm',
  uploadPreset: 'user_uploads',
  folder: 'user-profile',
};

// Get Cloudinary upload URL
export const getCloudinaryUploadUrl = () => {
  return `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
};

// Extract Cloudinary ID from URL
export const extractCloudinaryId = (url: string): string => {
  try {
    // URL format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/filename.jpg
    const regex = /\/v\d+\/(.+)\./;
    const match = url.match(regex);
    return match ? match[1] : '';
  } catch (error) {
    console.error('Error extracting Cloudinary ID:', error);
    return '';
  }
};

// Image compression utility
export function compressImage(base64String: string, maxWidth: number = 640, maxHeight: number = 480, quality: number = 0.6): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      const aspectRatio = width / height;
      
      if (width > maxWidth) {
        width = maxWidth;
        height = width / aspectRatio;
      }
      
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      
      resolve(compressedBase64);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = base64String;
  });
}

// Check if image size is too large (rough estimate)
export function isImageTooLarge(base64String: string, maxSizeKB: number = 500): boolean {
  // Remove data URL prefix to get just the base64 data
  const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
  // Calculate size in KB (base64 is ~33% larger than binary)
  const sizeInKB = (base64Data.length * 0.75) / 1024;
  return sizeInKB > maxSizeKB;
}
