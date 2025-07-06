"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLegalsOpen, setIsLegalsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsLegalsOpen(false);
  }, [pathname]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsLegalsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isLegalsOpen) setIsLegalsOpen(false);
  };

  const toggleLegals = () => {
    setIsLegalsOpen(!isLegalsOpen);
  };

  return (
    <nav className="fixed w-full bg-white/30 backdrop-blur-lg z-50 h-16" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logos/swrzee-logo.png" 
                alt="Swrzee Enterprise Logo" 
                width={110} 
                height={110}
                className="h-auto"
              />
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Legals Dropdown */}
            <div className="relative">
              <button 
                onClick={toggleLegals}
                className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <span>Policies</span>
                <FiChevronDown className={`ml-1 mt-1 transition-transform ${isLegalsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isLegalsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50"
                  >
                    <div className="py-1">
                      <Link href="/legals/terms-conditions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Terms & Conditions
                      </Link>
                      <Link href="/legals/privacy-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Privacy Policy
                      </Link>
                      <Link href="/legals/cancellation-refund" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Cancellation & Refund
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Pricing Link */}
            <Link href="/pricing" className="text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            
            {/* Corporate Login Link (for admin) */}
            <Link href="https://corporate.swrzee.in" className="text-gray-700 hover:text-gray-900">
              Corporate Login
            </Link>
            
            {/* Login Button (for public) */}
            <Link href="/login">
              <Button variant="outline" className="ml-4">
                Login
              </Button>
            </Link>
            
            {/* Register Button */}
            <Link href="/register">
              <Button>
                Get Started
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden bg-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Mobile Legals Menu */}
              <div className="border-t border-gray-200 pt-2">
                <button
                  onClick={toggleLegals}
                  className="w-full flex items-center justify-between px-3 py-2 text-gray-700"
                >
                  <span>Policies</span>
                  <FiChevronDown className={`transition-transform ${isLegalsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isLegalsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pl-4 space-y-1"
                    >
                      <Link href="/legals/terms-conditions" className="block px-3 py-2 text-sm text-gray-700">
                        Terms & Conditions
                      </Link>
                      <Link href="/legals/privacy-policy" className="block px-3 py-2 text-sm text-gray-700">
                        Privacy Policy
                      </Link>
                      <Link href="/legals/cancellation-refund" className="block px-3 py-2 text-sm text-gray-700">
                        Cancellation & Refund
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Mobile Pricing Link */}
              <Link href="/pricing" className="block px-3 py-2 text-gray-700">
                Pricing
              </Link>
              
              {/* Mobile Corporate Login Link */}
              <Link href="https://corporate.swrzee.in" className="block px-3 py-2 text-gray-700">
                Corporate Login
              </Link>
              
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3 space-x-2">
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="w-full">
                    <Button className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 