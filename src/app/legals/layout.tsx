import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SidebarNavigation from "./SidebarNavigation";

export default function LegalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Policies</h3>
                <SidebarNavigation />
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 