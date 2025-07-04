"use client";

import { useState } from "react";
import { FiUser, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProfileForm() {
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // In a real app, you would handle the API response here
      console.log("Profile saved");
    }, 1500);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">Personal Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName"
              defaultValue="John"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName"
              defaultValue="Smith"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              defaultValue="john.smith@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
        </div>
      </div>
      
      {/* Address */}
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">Address</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input 
              id="address"
              placeholder="123 Main St"
              required
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city"
                placeholder="New York"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input 
                id="state"
                placeholder="NY"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP / Postal Code</Label>
              <Input 
                id="zip"
                placeholder="10001"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <select 
              id="country"
              className="w-full h-10 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Select a country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="IN">India</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Company Information */}
      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">Company Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input 
              id="company"
              placeholder="Acme Inc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input 
              id="jobTitle"
              placeholder="Software Engineer"
            />
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
} 