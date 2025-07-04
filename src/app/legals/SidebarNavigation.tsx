"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNavigation() {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/legals/terms-conditions", label: "Terms & Conditions" },
    { href: "/legals/privacy-policy", label: "Privacy Policy" },
    // { href: "/legals/shipping-delivery", label: "Shipping & Delivery" },
    { href: "/legals/cancellation-refund", label: "Cancellation & Refund" },
    // { href: "/legals/cookies", label: "Cookies" },
  ];
  
  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`block px-3 py-2 rounded-md transition-colors ${
              isActive 
                ? "bg-gray-200 text-gray-900 font-medium" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
} 