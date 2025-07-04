import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Workshops | Swrzee Enterprise",
  description: "Explore our manufacturing workshops and training programs for skill development.",
};

const workshops = [
  {
    id: "slipper-manufacturing",
    title: "Slipper Manufacturing",
    description: "Learn to create comfortable and durable footwear using sustainable materials.",
    image: "/images/manufacturing/sandals.png",
  },
  {
    id: "paper-plate-production",
    title: "Paper Plate Production",
    description: "Master the art of producing eco-friendly paper plates for commercial use.",
    image: "/images/manufacturing/plate.png",
  },
  {
    id: "water-packaging",
    title: "Water Packaging",
    description: "Discover the process of safe and hygienic water packaging for local distribution.",
    image: "/images/manufacturing/bottle.png",
  },
  {
    id: "custom-packaging",
    title: "Custom Packaging",
    description: "Create innovative packaging solutions tailored to various product needs.",
    image: "/images/manufacturing/custom-pack.png",
  },
];

export default function WorkshopsPage() {
  return (
    <div className="py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Workshops</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore our hands-on manufacturing workshops designed to empower individuals with practical skills and sustainable livelihood opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {workshops.map((workshop) => (
          <Link 
            key={workshop.id}
            href={`/workshops/${workshop.id}`}
            className="group"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl">
              <div className="relative h-64 w-full">
                <Image
                  src={workshop.image}
                  alt={workshop.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {workshop.title}
                </h3>
                <p className="text-gray-600">{workshop.description}</p>
                <div className="mt-4 flex items-center text-blue-600 font-medium">
                  Learn more
                  <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 