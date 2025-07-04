import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation & Refund | Swrzee Enterprise",
  description: "Cancellation and refund policy for Swrzee Enterprise products and services.",
};

export default function CancellationRefund() {
  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Cancellation & Refund Policy</h1>
      <p className="text-gray-600 mb-6">Last Updated: January 1, 2025</p>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
        <p className="text-gray-700 mb-4">
          This Cancellation & Refund Policy outlines the terms and conditions for cancellations, returns, and refunds from Swrzee Enterprise and services booked with us. By placing an order or booking a service with us, you agree to the terms described in this policy.
        </p>
        <p className="text-gray-700 font-bold mb-4 bg-yellow-50 p-4 border-l-4 border-yellow-500">
          IMPORTANT NOTICE: Swrzee Enterprise does not provide refunds once payment has been made. All sales are final. Please review your order carefully before completing your purchase.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. No Refund Policy</h2>
        <p className="text-gray-700 mb-4">
          At Swrzee Enterprise, we maintain a strict no-refund policy. Once payment has been processed for any product or service, no refunds will be issued under any circumstances. This policy applies to all transactions, including but not limited to:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li>Service bookings</li>
          <li>Subscription payments</li>
          <li>Custom orders</li>
        </ul>
        <p className="text-gray-700 mb-4">
          We encourage all customers to carefully review their orders before finalizing any purchase. By completing your payment, you acknowledge and agree to our no-refund policy.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Order Cancellation</h2>
        <p className="text-gray-700 mb-4">
          Order cancellation is only possible before payment is processed. Once payment has been made, orders cannot be cancelled and no refunds will be provided.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Contact Information</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions about our no-refund policy, please contact us at:
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