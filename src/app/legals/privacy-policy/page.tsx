import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Swrzee Enterprise",
  description: "Privacy policy for Swrzee Enterprise website and services.",
};

export default function PrivacyPolicy() {
  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-6">Last Updated: January 1, 2025</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
        <p className="text-gray-700 mb-4">
          At Swrzee Enterprise, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, purchase our products, or participate in our training programs.
        </p>
        <p className="text-gray-700 mb-4">
          Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access our website or use our services.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
        
        <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Personal Information</h3>
        <p className="text-gray-700 mb-4">
          We may collect personal information that you voluntarily provide to us when you:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>Register for our training programs</li>
          <li>Purchase our products</li>
          <li>Subscribe to our newsletter</li>
          <li>Contact us through our website</li>
          <li>Participate in surveys or promotions</li>
        </ul>
        <p className="text-gray-700 mb-4">
          This information may include:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Postal address</li>
          <li>Payment information</li>
          <li>Educational background (for training participants)</li>
        </ul>
        
        <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
        <p className="text-gray-700 mb-4">
          When you visit our website, we may automatically collect certain information about your device, including:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>IP address</li>
          <li>Browser type</li>
          <li>Operating system</li>
          <li>Pages visited</li>
          <li>Time and date of your visit</li>
          <li>Referring website</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
        <p className="text-gray-700 mb-4">
          We may use the information we collect for various purposes, including:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>Providing and maintaining our services</li>
          <li>Processing and fulfilling orders</li>
          <li>Managing training program registrations</li>
          <li>Sending administrative information</li>
          <li>Sending marketing and promotional communications</li>
          <li>Responding to inquiries and offering support</li>
          <li>Improving our website and services</li>
          <li>Protecting against fraud and unauthorized transactions</li>
          <li>Complying with legal obligations</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Contact Information</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
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