"use client";

import { motion } from "framer-motion";
import { FaIndustry, FaRecycle, FaShippingFast, FaUserFriends } from "react-icons/fa";

const stats = [
  {
    icon: <FaIndustry size={24} />,
    value: "1+",
    label: "Years Experience",
    description: "Manufacturing excellence and industry expertise"
  },
  {
    icon: <FaRecycle size={24} />,
    value: "90%",
    label: "Recyclable Materials",
    description: "Commitment to sustainable manufacturing practices"
  },
  {
    icon: <FaShippingFast size={24} />,
    value: "10K+",
    label: "Monthly Production",
    description: "Units manufactured and delivered each month"
  },
  {
    icon: <FaUserFriends size={24} />,
    value: "20+",
    label: "Business Partners",
    description: "Trusted distributors and retail partners worldwide"
  }
];

const StatCard = ({ stat, index }: { stat: typeof stats[0], index: number }) => {
  return (
    <motion.div
      className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4">
        {stat.icon}
      </div>
      <div>
        <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
        <h3 className="text-lg font-semibold text-gray-900 mt-1">{stat.label}</h3>
        <p className="text-gray-600 mt-1">{stat.description}</p>
      </div>
    </motion.div>
  );
};

const Stats = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Manufacturing Impact
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our commitment to quality, sustainability, and customer satisfaction
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats; 