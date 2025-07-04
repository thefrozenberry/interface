import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water Packaging Workshop | Swrzee Enterprise",
  description: "Learn the process of safe and hygienic water packaging for local distribution.",
};

export default function WaterPackagingPage() {
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
            src="/images/manufacturing/bottle.png"
            alt="Water Packaging"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Water Packaging Workshop</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Our Water Packaging Workshop provides comprehensive training on establishing and operating a small-scale water purification and packaging unit, with a strong focus on safety, hygiene, and regulatory compliance.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">What You'll Learn</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Water purification technologies and processes</li>
              <li>Quality testing and safety standards</li>
              <li>Packaging equipment operation and maintenance</li>
              <li>Regulatory compliance and certification</li>
              <li>Hygiene protocols and contamination prevention</li>
              <li>Supply chain management and distribution</li>
              <li>Business operations and financial planning</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Workshop Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Duration</h3>
                <p className="text-gray-700">7 days (56 hours total)</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Batch Size</h3>
                <p className="text-gray-700">Maximum 10 participants</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Prerequisites</h3>
                <p className="text-gray-700">Basic understanding of hygiene standards</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Materials</h3>
                <p className="text-gray-700">All equipment and training materials provided</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Business Potential</h2>
            <p className="text-gray-700 mb-4">
              Clean drinking water is a fundamental necessity, creating consistent demand. By establishing a water packaging unit, participants can:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Provide safe drinking water to local communities</li>
              <li>Supply to schools, offices, events, and retail outlets</li>
              <li>Develop branded water products for the local market</li>
              <li>Create employment opportunities within the community</li>
              <li>Address a critical health need while building a sustainable business</li>
            </ul>
            
            <div className="bg-gray-100 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Important Note</h3>
              <p className="text-gray-700">
                This workshop includes information on regulatory requirements and certification processes necessary for operating a water packaging business. Participants will be guided through the proper channels for obtaining required permits.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Ready to Get Started?</h2>
              <p className="text-gray-700 mb-4">
                Join our next workshop batch and learn how to establish your own water packaging business.
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