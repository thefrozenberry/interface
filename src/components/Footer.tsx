import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center mb-6">
              <Image 
                src="/logos/swrzee-logo.png" 
                alt="Swrzee Enterprise Logo" 
                width={150} 
                height={60}
                className="h-auto"
              />
            </div>
            <p className="mt-4 text-gray-300 max-w-xs">
              Empowering local communities through manufacturing training and sustainable livelihood opportunities in slipper making, paper plate production, and packaged water.
            </p>
            {/* <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                <span className="sr-only">WhatsApp</span>
                <FaWhatsapp size={24} />
              </a>
            </div> */}
          </div>
          
          <div className="col-span-1 md:col-span-3">
            {/* <h3 className="text-lg font-semibold text-white mb-4">Workshops</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/workshops/slipper-manufacturing" className="text-gray-300 hover:text-green-400 transition-colors">
                  Slipper Manufacturing
                </Link>
              </li>
              <li>
                <Link href="/workshops/paper-plate-production" className="text-gray-300 hover:text-green-400 transition-colors">
                  Paper Plate Production
                </Link>
              </li>
              <li>
                <Link href="/workshops/water-packaging" className="text-gray-300 hover:text-green-400 transition-colors">
                  Water Packaging
                </Link>
              </li>
              <li>
                <Link href="/workshops/custom-packaging" className="text-gray-300 hover:text-green-400 transition-colors">
                  Custom Packaging
                </Link>
              </li>
            </ul> */}
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              {/* <li>
                <Link href="/about" className="text-gray-300 hover:text-green-400 transition-colors">
                  Learn More
                </Link>
              </li> */}
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-green-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-green-400" />
                <span className="text-gray-300">Kokrajhar, Bodoland, Assam, India - 783370</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-green-400" />
                <a href="tel:+917002689522" className="text-gray-300 hover:text-green-400 transition-colors">+91 70026 89522</a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-green-400" />
                <a href="mailto:support@swrzee.in" className="text-gray-300 hover:text-green-400 transition-colors">support@swrzee.in</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Swrzee Enterprise. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
            <Link href="/legals/terms-conditions" className="text-sm text-gray-400 hover:text-green-400">
              Terms & Conditions
            </Link>
            <Link href="/legals/privacy-policy" className="text-sm text-gray-400 hover:text-green-400">
              Privacy Policy
            </Link>
            {/* <Link href="/legals/shipping-delivery" className="text-sm text-gray-400 hover:text-green-400">
              Shipping & Delivery
            </Link> */}
            <Link href="/legals/cancellation-refund" className="text-sm text-gray-400 hover:text-green-400">
              Cancellation & Refund
            </Link>
            {/* <Link href="/legals/cookies" className="text-sm text-gray-400 hover:text-green-400">
              Cookies
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 