import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paper Plate Production Workshop | Swrzee Enterprise",
  description: "Learn to produce eco-friendly paper plates for commercial and domestic use.",
};

export default function PaperPlateProductionPage() {
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
            src="/images/manufacturing/plate.png"
            alt="Paper Plate Production"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Paper Plate Production Workshop</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Our Paper Plate Production Workshop equips participants with the knowledge and skills to establish and operate a small-scale paper plate manufacturing unit, focusing on eco-friendly materials and efficient production techniques.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">What You'll Learn</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Raw material selection and sourcing strategies</li>
              <li>Machine operation and maintenance</li>
              <li>Production process optimization</li>
              <li>Quality control standards and testing</li>
              <li>Packaging and storage best practices</li>
              <li>Distribution channels and marketing basics</li>
              <li>Financial management for small production units</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Workshop Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Duration</h3>
                <p className="text-gray-700">3 days (24 hours total)</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Batch Size</h3>
                <p className="text-gray-700">Maximum 12 participants</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Prerequisites</h3>
                <p className="text-gray-700">Basic understanding of manufacturing concepts</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Materials</h3>
                <p className="text-gray-700">All materials and equipment provided</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Business Potential</h2>
            <p className="text-gray-700 mb-4">
              The demand for disposable paper plates is consistently high across various sectors. By establishing a paper plate production unit, participants can:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Supply to local restaurants, food stalls, and catering services</li>
              <li>Produce eco-friendly alternatives to plastic plates</li>
              <li>Create customized designs for events and celebrations</li>
              <li>Expand into related paper products (cups, bowls, etc.)</li>
              <li>Tap into growing environmental consciousness among consumers</li>
            </ul>
            
            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Ready to Get Started?</h2>
              <p className="text-gray-700 mb-4">
                Join our next workshop batch and learn how to establish your own paper plate production business.
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