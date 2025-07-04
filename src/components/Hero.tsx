"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FiArrowRight } from "react-icons/fi";

const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-64px)] pt-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column - Content */}
          <motion.div 
            className="lg:col-span-7 text-center lg:text-left py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-400">
                Swrzee Enterprise,
              </span>
              <br />
              for the Crafted Future
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
            Established in 2025, we are a micro manufacturing and training centre dedicated to empowering local communities through hands-on skill development and sustainable livelihood opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="group" onClick={() => {
                window.location.href = "/register";
              }}>
                Get Started
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              {/* <Button size="lg" variant="outline" onClick={() => {
                window.location.href = "/about";
              }}>
                Learn More
              </Button> */}
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[
                  { id: 1, src: "/profile/1.jpg" },
                  { id: 2, src: "/profile/2.jpg" },
                  { id: 3, src: "/profile/3.jpg" },
                  { id: 4, src: "/profile/4.jpg" }
                ].map((profile) => (
                  <div key={profile.id} className="w-10 h-10 rounded-full border-2 border-white shadow-md relative overflow-hidden ring-2 ring-gray-200">
                    <Image 
                      src={profile.src} 
                      alt={`Profile ${profile.id}`} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="ml-4 text-sm text-gray-600">
              Over <span className="font-bold text-gray-900">100+</span> attendees enrolled this batch
              </p>
            </div>
          </motion.div>
          
          {/* Right Column - Image */}
          <motion.div 
            className="lg:col-span-5 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative h-[400px] sm:h-[500px] lg:h-[calc(100vh-64px)] w-full">
              <Image
                src="/images/interface-background.png"
                alt="Interface Background"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 