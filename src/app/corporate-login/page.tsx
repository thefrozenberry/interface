import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Corporate Login | Swrzee Enterprise",
  description: "Secure login portal for corporate clients of Swrzee Enterprise.",
};

export default function CorporateLogin() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-md px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Corporate Login</h1>
            <p className="text-gray-600">
              Access your corporate account to manage your training programs and orders.
            </p>
          </div>
          
          <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
} 