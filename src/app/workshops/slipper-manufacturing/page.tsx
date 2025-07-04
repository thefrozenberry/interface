import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slipper Manufacturing Workshop | Swrzee Enterprise",
  description: "Learn the art of creating comfortable and durable footwear using sustainable materials.",
};

export default function SlipperManufacturingPage() {
  return (
    <div className="py-12">
      <Link 
        href="/workshops" 
        className="inline-flex items-center text-blue-600 mb-8 hover:text-blue-800 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Workshops
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96 w-full">
          <Image
            src="/images/manufacturing/sandals.png"
            alt="Slipper Manufacturing"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Slipper Manufacturing Workshop</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Our Slipper Manufacturing Workshop is designed to teach participants the complete process of creating comfortable, durable, and marketable footwear using locally sourced and sustainable materials.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">What You'll Learn</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Material selection and quality assessment</li>
              <li>Pattern making and size standardization</li>
              <li>Cutting and assembly techniques</li>
              <li>Sole attachment and finishing methods</li>
              <li>Quality control and product testing</li>
              <li>Basic branding and packaging</li>
              <li>Cost calculation and pricing strategies</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Workshop Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Duration</h3>
                <p className="text-gray-700">5 days (40 hours total)</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Batch Size</h3>
                <p className="text-gray-700">Maximum 15 participants</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Prerequisites</h3>
                <p className="text-gray-700">No prior experience required</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Materials</h3>
                <p className="text-gray-700">All materials provided</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Business Potential</h2>
            <p className="text-gray-700 mb-4">
              Footwear is an essential product with consistent demand across all demographics. By learning slipper manufacturing, participants can:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Start a small-scale production unit with minimal investment</li>
              <li>Supply to local retailers or sell directly to consumers</li>
              <li>Create customized designs for special occasions or specific needs</li>
              <li>Expand into related footwear products as skills develop</li>
            </ul>
            
            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Ready to Get Started?</h2>
              <p className="text-gray-700 mb-4">
                Join our next workshop batch and take your first step toward mastering the craft of slipper manufacturing.
              </p>
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-8"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 