import { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pricing | Swrzee Enterprise",
  description: "Pricing and course fees for Swrzee Enterprise training programs.",
};

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Pricing & Course Fees</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Affordable training programs to empower your manufacturing skills
            </p>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Fee Information */}
            <div className="bg-white shadow-sm rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Internship Course Fee</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Registration fee</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹50.00</td>
                      <td className="px-6 py-4 text-sm text-gray-500"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Materials Cost</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹200.00</td>
                      <td className="px-6 py-4 text-sm text-gray-500"></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Trainers / Instructor</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹250.00</td>
                      <td className="px-6 py-4 text-sm text-gray-500">(@ ₹50 per day/trainee)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Certificates/Misc.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹50.00</td>
                      <td className="px-6 py-4 text-sm text-gray-500"></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₹ 550.00</td>
                      <td className="px-6 py-4 text-sm text-gray-500"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                <span className="font-bold">Special Discount:</span> Course fee concession (except Registration fee & Certificate fee) is available for Kokrajhar Govt. College Students for the summer internship programme-2025.
              </p>
              <div className="mt-6 text-left">
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Pay Now
                </a>
              </div>
            </div>
            
            {/* Course Details */}
            <div className="bg-white shadow-sm rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">What's Included</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Program Structure</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li><span className="font-medium">Duration:</span> 30 hours (5 days × 6 hours/day)</li>
                    <li><span className="font-medium">Credits:</span> 2 credits (aligned with 30 contact hours)</li>
                    <li><span className="font-medium">Module 1:</span> Slipper Making (18 hours) - Days 1-3</li>
                    <li><span className="font-medium">Module 2:</span> Eco-Friendly Paper Dish Making (12 hours) - Days 4-5</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Resources Provided</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>All materials required for practical training</li>
                    <li>Safety equipment (gloves, goggles, etc.)</li>
                    <li>Expert guidance from industry professionals</li>
                    <li>Internship completion certificate</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Daily Schedule</h3>
                  <p className="text-gray-700"><span className="font-medium">9:00 AM–12:00 PM:</span> Slipper making (Days 1–3) / Paper dishes (Days 4–5)</p>
                  <p className="text-gray-700"><span className="font-medium">1:00 PM–4:00 PM:</span> Hands-on production, quality analysis, troubleshooting</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Enhance Your Skills?</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Join our internship program and gain hands-on experience in sustainable manufacturing. Limited seats available for each batch.
            </p>
            <div className="flex justify-center">
              <a 
                href="/register" 
                className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Register Now
              </a>
              <a 
                href="/about" 
                className="ml-4 bg-white text-gray-900 border border-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                About Us
              </a>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="mt-12 text-center">
            <p className="text-gray-700">
              For more information about our pricing and special discounts, please contact us at:
            </p>
            <p className="text-gray-700 font-medium mt-2">
              Email: enterprise@swrzee.in | Tel: +91 7002689522
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 