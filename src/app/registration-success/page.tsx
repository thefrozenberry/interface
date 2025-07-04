import { Metadata } from "next";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Registration Successful | Swrzee Enterprise",
  description: "Your account has been created successfully.",
};

export default function RegistrationSuccess() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h1>
          
          <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-8 mb-8">
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. Please login to your account to start using our services.
            </p>
            
            <div className="space-y-4">
              <Link href="/login">
                <Button className="w-full">
                  Login to Your Account
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" className="w-full mt-4">
                  Return to Homepage
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 