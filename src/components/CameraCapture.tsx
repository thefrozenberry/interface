import React, { useRef, useEffect, useState } from 'react';
import { FiCamera, FiX, FiRotateCw } from 'react-icons/fi';

interface CameraCaptureProps {
  onCapture: (photoData: string) => void;
  onClose: () => void;
  mode: 'checkin' | 'checkout';
  isUploading?: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose, mode, isUploading = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Show success animation when upload completes
  useEffect(() => {
    if (!isUploading && showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isUploading, showSuccess]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user', // Front camera
          width: { ideal: 640, max: 800 }, // Reduced from 1280
          height: { ideal: 480, max: 600 }  // Reduced from 720
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please check permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas size to a smaller, fixed size for consistency
        const maxWidth = 640;
        const maxHeight = 480;
        
        // Calculate aspect ratio to maintain proportions
        const videoAspectRatio = video.videoWidth / video.videoHeight;
        let canvasWidth = maxWidth;
        let canvasHeight = maxHeight;
        
        if (videoAspectRatio > 1) {
          // Landscape
          canvasHeight = maxWidth / videoAspectRatio;
        } else {
          // Portrait
          canvasWidth = maxHeight * videoAspectRatio;
        }
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Draw video frame to canvas with scaling
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64 with reduced quality (0.6 instead of 0.8)
        const photoData = canvas.toDataURL('image/jpeg', 0.6);
        
        // Stop camera stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        // Call the capture callback
        onCapture(photoData);
        setShowSuccess(true);
      }
    }
  };

  const retakePhoto = () => {
    startCamera();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={startCamera}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden max-w-md mx-4">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {mode === 'checkin' ? 'Check In' : 'Check Out'} - Take Photo
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Camera View */}
        <div className={`relative transition-all duration-300 ${isUploading ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}>
          {isLoading && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p>Starting camera...</p>
              </div>
            </div>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-10">
              <div className="text-white text-center">
                <div className="w-12 h-12 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg font-medium">Processing...</p>
                <p className="text-sm text-gray-300 mt-1">Please wait</p>
              </div>
            </div>
          )}
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-64 object-cover transition-all duration-300 ${isUploading ? 'blur-sm scale-95' : 'blur-0 scale-100'}`}
            onLoadedMetadata={() => setIsLoading(false)}
          />
          
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Success Animation */}
          {showSuccess && !isUploading && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-green-700 font-semibold">Photo Captured Successfully!</p>
                <p className="text-green-600 text-sm">Processing your {mode === 'checkin' ? 'check-in' : 'check-out'}...</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={retakePhoto}
              disabled={isUploading}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRotateCw className="h-4 w-4" />
              Retake
            </button>
            <button
              onClick={capturePhoto}
              disabled={isLoading || isUploading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
                              ) : (
                  <>
                    <FiCamera className={`h-4 w-4 ${!isLoading ? 'animate-pulse' : ''}`} />
                    Capture
                  </>
                )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture; 