import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Packaging Workshop | Swrzee Enterprise",
  description: "Learn to create innovative packaging solutions tailored to various product needs.",
};

export default function CustomPackagingPage() {
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
            src="/images/manufacturing/custom-pack.png"
            alt="Custom Packaging"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Custom Packaging Workshop</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Our Custom Packaging Workshop teaches participants how to design, create, and produce innovative packaging solutions for various products, with a focus on sustainability, functionality, and visual appeal.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">What You'll Learn</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Packaging design principles and techniques</li>
              <li>Material selection and sustainability considerations</li>
              <li>Structural design and prototyping</li>
              <li>Printing and finishing methods</li>
              <li>Brand integration and visual communication</li>
              <li>Cost optimization and production efficiency</li>
              <li>Market trends and consumer preferences</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Workshop Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Duration</h3>
                <p className="text-gray-700">4 days (32 hours total)</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Batch Size</h3>
                <p className="text-gray-700">Maximum 8 participants</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Prerequisites</h3>
                <p className="text-gray-700">Basic design understanding helpful but not required</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Materials</h3>
                <p className="text-gray-700">All design tools and materials provided</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Business Potential</h2>
            <p className="text-gray-700 mb-4">
              Custom packaging is in high demand across numerous industries. By mastering packaging design and production, participants can:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Offer packaging design services to local businesses</li>
              <li>Create specialized packaging for artisanal and small-batch products</li>
              <li>Develop eco-friendly packaging alternatives</li>
              <li>Provide packaging solutions for events and special occasions</li>
              <li>Partner with e-commerce businesses for branded packaging needs</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Who Should Attend</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Entrepreneurs looking to start a packaging business</li>
              <li>Small business owners wanting to create custom packaging for their products</li>
              <li>Designers interested in expanding into packaging design</li>
              <li>Marketing professionals seeking to understand packaging's role in branding</li>
              <li>Anyone interested in sustainable packaging solutions</li>
            </ul>
            
            <div className="bg-blue-50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Ready to Get Started?</h2>
              <p className="text-gray-700 mb-4">
                Join our next workshop batch and learn how to create innovative packaging solutions.
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