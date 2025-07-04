"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
            <div>
              <motion.h2
                className="text-3xl font-bold tracking-tight text-black sm:text-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="block">Ready to start manufacturing?</span>
                <span className="block">Join our next workshop.</span>
              </motion.h2>
              <motion.p
                className="mt-4 text-lg leading-6 text-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Learn practical skills in slipper making, paper plate production, and water packaging. Limited seats available.
              </motion.p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 lg:mt-0 lg:flex-shrink-0">
              <motion.div
                className="inline-flex"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button onClick={() => {
                  window.location.href = "/register";
                }} size="lg" className="w-full sm:w-auto text-lg py-6 px-8 bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all font-semibold">
                Register Now
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA; 