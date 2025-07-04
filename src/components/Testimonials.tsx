"use client";

import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    name: "Himdip Narzary",
    role: "Workshop Participant",
    business: "Swrzee Enterprise",
    content: "The slipper manufacturing workshop gave me practical insights to streamline my production process. I've already implemented several techniques that have increased our output by 30%.",
    rating: 5
  },
  {
    name: "Arup Das",
    role: "Student",
    business: "Swrzee Enterprise",
    content: "Learning about sustainable paper plate manufacturing has transformed my business model. The eco-friendly techniques shared in the workshop helped me reduce waste while improving product quality.",
    rating: 5
  },
  {
    name: "Deepjyoti Dey",
    role: "Entrepreneur",
    business: "Swrzee Enterprise",
    content: "The water bottling workshop was incredibly informative. The knowledge I gained about filtration systems and quality control has been invaluable in setting up my packaged water business.",
    rating: 5
  }
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  return (
    <motion.div
      className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <div className="flex text-yellow-400 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <FiStar key={i} className="fill-current" />
        ))}
      </div>
      <p className="text-gray-600 italic mb-6">"{testimonial.content}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
          {testimonial.name.charAt(0)}
        </div>
        <div className="ml-4">
          <h4 className="text-base font-semibold text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
          <p className="text-xs text-green-600 font-medium">{testimonial.business}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
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
            Workshop Success Stories
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Hear from entrepreneurs who have transformed their manufacturing businesses after attending our workshops
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;