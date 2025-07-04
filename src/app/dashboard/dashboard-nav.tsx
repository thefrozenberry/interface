"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiUser, FiCreditCard, FiSettings, FiLogOut, FiCalendar, FiX } from "react-icons/fi";

interface DashboardNavProps {
  onMobileClose?: () => void;
}

export function DashboardNav({ onMobileClose }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <FiHome className="h-4 w-4" />
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: <FiUser className="h-4 w-4" />
    },
    {
      name: "Attendance",
      href: "/dashboard/attendance",
      icon: <FiCalendar className="h-4 w-4" />
    },
    {
      name: "Payments",
      href: "/dashboard/payments",
      icon: <FiCreditCard className="h-4 w-4" />
    }
  ];

  const handleLogout = async () => {
    try {
      // Get tokens from localStorage
      const storedTokens = localStorage.getItem('tokens');
      if (storedTokens) {
        const { accessToken, refreshToken } = JSON.parse(storedTokens);
        
        // Call logout API
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            refreshToken: refreshToken
          })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('tokens');
      
      // Close mobile menu before redirecting
      if (onMobileClose) {
        onMobileClose();
      }
      
      // Redirect to home page for fresh start
      router.replace('/');
    }
  };

  const handleNavigation = (href: string) => {
    // Close mobile menu before navigation
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <nav className="w-64 bg-white border-r border-gray-100 h-full overflow-y-auto">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
        <button
          onClick={onMobileClose}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Close menu"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
      
      <div className="py-8 px-5">
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold ml-2 mb-3">Main Menu</h2>
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`flex items-center px-4 py-4 md:py-3 text-sm rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <span className={`mr-3 ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                    {item.icon}
                  </span>
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-1 h-5 bg-blue-500 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-100 mt-auto">
          <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold ml-2 mb-3">Account</h2>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-4 md:py-3 text-sm rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <span className="mr-3 text-gray-400">
              <FiLogOut className="h-4 w-4" />
            </span>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
} 