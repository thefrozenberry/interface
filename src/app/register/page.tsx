import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { RegistrationForm } from "./registration-form";

export const metadata: Metadata = {
  title: "Register | Swrzee Enterprise",
  description: "Create a new account with Swrzee Enterprise and get started.",
};

export default function Register() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">
              Join Swrzee Enterprise and get access to our services.
            </p>
          </div>
          
          <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-8">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </div>
  );
} 