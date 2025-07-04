"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    image: "/images/manufacturing/sandals.png",
    title: "Slipper Manufacturing",
    description: "High-quality, comfortable footwear production with modern designs and eco-friendly materials."
  },
  {
    image: "/images/manufacturing/plate.png",
    title: "Paper Plate Manufacturing",
    description: "Sustainable, biodegradable paper plates made from recycled materials for eco-conscious consumers."
  },
  {
    image: "/images/manufacturing/bottle.png",
    title: "Packaged Water Production",
    description: "Pure, mineral-rich bottled water with state-of-the-art filtration and quality testing processes."
  },
  {
    image: "/images/manufacturing/custom-pack.png",
    title: "Custom Packaging Solutions",
    description: "Innovative packaging designs that enhance product presentation and ensure safe delivery."
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <div className="relative h-75 w-full">
        <Image 
          src={feature.image}
          alt={feature.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    </motion.div>
  );
};

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Manufacturing Excellence
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover our range of high-quality manufacturing solutions designed for efficiency and sustainability
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 