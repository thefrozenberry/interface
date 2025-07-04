"use client";

import { useState, useEffect } from "react";
import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DashboardNav } from "./dashboard-nav";
import { FiMenu, FiX } from "react-icons/fi";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [userInitials, setUserInitials] = useState("JS");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      // Get user data from localStorage
      const storedUser = localStorage.getItem('user');
      const storedTokens = localStorage.getItem('tokens');
      
      if (!storedUser || !storedTokens) {
        // Clear any existing data and redirect to home page
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
        router.replace('/');
        return;
      }
      
      try {
        const parsedUser = JSON.parse(storedUser);
        const parsedTokens = JSON.parse(storedTokens);
        
        // Validate tokens exist
        if (!parsedTokens.accessToken || !parsedTokens.refreshToken) {
          localStorage.removeItem('user');
          localStorage.removeItem('tokens');
          router.replace('/');
          return;
        }
        
        // Set user initials
        if (parsedUser.firstName && parsedUser.lastName) {
          setUserInitials(
            `${parsedUser.firstName.charAt(0)}${parsedUser.lastName.charAt(0)}`
          );
        }
        
        // Set user image if available
        if (parsedUser.profileImage) {
          setUserImage(parsedUser.profileImage);
        }
        
        // Mark as authenticated
        setIsAuthenticated(true);
        
        // Check if profile is complete, if not redirect to profile completion page
        if (!parsedUser.profileComplete) {
          router.replace('/profile');
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
        router.replace('/');
      } finally {
        setIsLoading(false);
      }
    }
  }, [router]);
  
  // Add keyboard event listener for mobile menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation - Fixed Position */}
      <header className="bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-10 w-full max-w-[1600px] mx-auto">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 active:scale-95 relative"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-5 w-5 transition-transform duration-200" />
              ) : (
                <FiMenu className="h-5 w-5 transition-transform duration-200" />
              )}
              {/* Mobile indicator dot */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full md:hidden"></div>
            </button>
            
            <Link href="/" className="flex items-center">
              <Image 
                src="/logos/swrzee-logo.png" 
                alt="Swrzee Enterprise Logo" 
                width={110} 
                height={110}
                className="h-auto w-28"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-5">
            {userImage && typeof userImage === 'string' && userImage.trim() !== "" ? (
              <div className="h-9 w-9 rounded-full overflow-hidden">
                <Image 
                  src={userImage} 
                  alt="Profile" 
                  width={36} 
                  height={36}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                {userInitials}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - Fixed on desktop, overlay on mobile */}
        <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:top-0 md:flex-shrink-0`}>
          <DashboardNav onMobileClose={() => setIsMobileMenuOpen(false)} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full md:w-auto md:ml-0">
          <div className="p-4 md:p-6 lg:p-10">
            <div className="bg-white rounded-xl border border-gray-100 min-h-[calc(100vh-8rem)]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 