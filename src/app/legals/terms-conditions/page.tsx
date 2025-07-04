import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Swrzee Enterprise",
  description: "Terms and conditions for using Swrzee Enterprise services and products.",
};

export default function TermsConditions() {
  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
      <p className="text-gray-600 mb-6">Last Updated: January 1, 2025</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
        <p className="text-gray-700 mb-4">
          Welcome to Swrzee Enterprise. These Terms and Conditions govern your use of our website, products, and services. By accessing or using our website, purchasing our products, or engaging with our services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use our services.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Definitions</h2>
        <p className="text-gray-700 mb-4">
          <strong>"Company"</strong> refers to Swrzee Enterprise, registered in Kokrajhar, Bodoland, Assam, India.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>"Services"</strong> refers to the manufacturing training, products, and related services provided by Swrzee Enterprise.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>"User"</strong> refers to any individual accessing our website or using our services.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>"Products"</strong> refers to physical goods manufactured and sold by Swrzee Enterprise.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Products and Services</h2>
        <p className="text-gray-700 mb-4">
          Swrzee Enterprise offers manufacturing training and produces various products including but not limited to slippers, paper plates, and packaged water. We reserve the right to modify, suspend, or discontinue any aspect of our products or services at any time without prior notice.
        </p>
        <p className="text-gray-700 mb-4">
          All product descriptions, specifications, and pricing are subject to change without notice. While we strive for accuracy in our product descriptions and images, slight variations may occur.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. User Obligations</h2>
        <p className="text-gray-700 mb-4">
          By using our services, you agree to:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>Provide accurate and complete information when purchasing products or enrolling in training programs.</li>
          <li>Use our services and products only for their intended purposes.</li>
          <li>Comply with all applicable laws and regulations.</li>
          <li>Not engage in any activity that may interfere with or disrupt our services.</li>
          <li>Not attempt to gain unauthorized access to any part of our website or services.</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Governing Law</h2>
        <p className="text-gray-700 mb-4">
          These terms are governed by law of India.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Contact Information</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions about these Terms and Conditions, please contact us at:
        </p>
        <address className="not-italic text-gray-700 mb-4">
          Swrzee Enterprise<br />
          Kokrajhar, Bodoland, Assam, India - 783370<br />
          Email: support@swrzee.in<br />
          Phone: +91 70026 89522
        </address>
      </section>
    </div>
  );
} 