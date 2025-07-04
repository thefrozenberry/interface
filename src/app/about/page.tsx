import Image from "next/image";

export default function LearnMore() {
  return (
    <main className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Image 
                src="/logos/swrzee-logo.png" 
                alt="Swrzee Enterprise Logo" 
                width={150} 
                height={150}
                className="h-auto"
                priority
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">SWRZEE ENTERPRISE</h1>
            <p className="text-lg text-gray-600 mb-1">Micro Manufacturing cum Training Centre</p>
            <p className="text-sm text-gray-500 mb-1">Udyam Regd. No. AS-19 - 0018220 | Estd-01-01-2025</p>
            <p className="text-sm text-gray-500 mb-1">PO & Dist. - Kokrajhar : Bodoland : Assam : 783370</p>
            <p className="text-sm text-gray-500 mb-1">Email - enterprise@swrzee.in</p>
            <p className="text-md italic text-gray-700 mt-4">(Motto: Empowering Hands, Enriching Communities)</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">ABOUT SWRZEE ENTERPRISE</h2>
          <div className="text-gray-700 space-y-4">
            <p>
              SWRZEE Enterprise, a pioneering Micro Manufacturing cum Training Centre nestled in
              Kokrajhar, Bodoland, Assam, was established and Registered UDYAM AS-19- 0018220, Govt. of
              India under Ministry of Micro, Small and Medium Enterprises (MSME) on 1st January 2025 with
              a dual mission: to empower local communities through skill development and to produce
              affordable, sustainable products for societal benefit.
            </p>
            <p>
              We specialize in hands-on vocational training for students and aspiring entrepreneurs,
              focusing on eco-friendly product manufacturing such as slippers, paper dishes, and other utility
              items. Our 30-hour internship programs blend practical skill-building with entrepreneurial
              insights, enabling trainees to master small-scale manufacturing processes.
            </p>
            <p>
              SWRZEE ENTERPRISE manufactures high-quality, low-cost multi-products, ensuring
              accessibility for all sections of communities and imparts training to the deserving individuals and
              students. Participants who successfully complete the program will receive an Internship
              certificate, validating their expertise in design, production, and quality control.
            </p>
            <p>
              Committed to fostering self-reliance and sustainability, through self-employment.
              SWRZEE ENTERPRISE bridges skill gaps, fuels local economies, and delivers innovative solutions
              to everyday needs of the people.
            </p>
          </div>
        </div>

        {/* Internship Course Outline */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">1. Internship Course Outline</h2>
          <div className="text-gray-700 space-y-4">
            <p>
              This structured, hands-on program ensures students gain marketable skills while fostering
              innovation in sustainable manufacturing.
            </p>
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/4">Objective</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Equip students with hands-on skills in slipper and paper dish manufacturing.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Duration</td>
                    <td className="px-6 py-4 text-sm text-gray-700">30 hours (5 days × 6 hours/day).</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Credits</td>
                    <td className="px-6 py-4 text-sm text-gray-700">2 credits (aligned with 30 contact hours).</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Target Group</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Students pursuing vocational studies, design, or entrepreneurship.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 bg-gray-50">Key Outcomes</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <p className="mb-2">After completion of the course, the students will be:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Proficient in crafting eco-friendly slippers and paper dishes manufacturing.</li>
                        <li>Understand small-scale manufacturing processes.</li>
                        <li>Enhanced creativity, teamwork, and entrepreneurial thinking.</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Programme Structure */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">2. Programme Structure</h2>
          <div className="text-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 mb-8">
                <thead className="bg-gray-50">
                  <tr>
                    <th colSpan={4} className="px-6 py-3 text-left text-base font-semibold text-gray-900">Module 1: Slipper Making (18 hours) - Day 1-3</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/6">Theory</td>
                    <td colSpan={3} className="px-6 py-4 text-sm text-gray-700">Material selection (rubber, EVA foam), design principles, safety protocols.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Practical</td>
                    <td colSpan={3} className="px-6 py-4 text-sm text-gray-700">Cutting soles, attaching straps, finishing, quality checks, packaging & Marketing.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Tools</td>
                    <td colSpan={3} className="px-6 py-4 text-sm text-gray-700">Molds, cutting machines, adhesives, safety gear.</td>
                  </tr>
                </tbody>
              </table>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th colSpan={4} className="px-6 py-3 text-left text-base font-semibold text-gray-900">Module 2: Eco-Friendly Paper Dish Making (12 hours) - Day 4–5</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/6">Theory</td>
                    <td colSpan={3} className="px-6 py-4 text-sm text-gray-700">Recycled paper processing, molding techniques, packaging & Marketing.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Practical</td>
                    <td colSpan={3} className="px-6 py-4 text-sm text-gray-700">Pulp preparation, pressing, drying, finishing.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Tools</td>
                    <td colSpan={3} className="px-6 py-4 text-sm text-gray-700">Blenders, molds, presses, UV dryers.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Assessment & Grading */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">3. Assessment & Grading (20 Marks)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Marks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criteria</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Practical Skills (Slippers)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Precision, adherence to design, finishing</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Practical Skills (Dishes)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Consistency, durability, aesthetic appeal</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Attendance/Punctuality</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Full attendance =3 (1 mark deducted per 2 hours missed)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Final Report/Presentation</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Clarity, creativity, and reflection on learning.</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Credit</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">20</td>
                  <td className="px-6 py-4 text-sm text-gray-500"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Grading Scale */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">4. Grading Scale</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scale</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Outstanding</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">O</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18-20</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Exceptional skill mastery, flawless products, full attendance</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Excellent</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">A</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15-17</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Good execution, minor flaws, up to 2 hours missed.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Very Good</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">B</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12-14</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Basic competency, noticeable errors, up to 4 hours missed.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Good</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">C</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">9-11</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Minimal proficiency, incomplete work, up to 4 hours missed.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">5. Daily Schedule</h2>
          <div className="text-gray-700 space-y-2">
            <p><span className="font-semibold">9:00 AM–12:00 PM:</span> Slipper making (Days 1–3) / Paper dishes (Days 4–5).</p>
            <p><span className="font-semibold">1:00 PM–4:00 PM:</span> Hands-on production, quality analysis, troubleshooting.</p>
          </div>
        </div>

        {/* Resources & Safety */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">6. Resources & Safety</h2>
          <div className="text-gray-700 space-y-2">
            <p><span className="font-semibold">Materials:</span> Rubber sheets, adhesives, recycled paper, dyes.</p>
            <p><span className="font-semibold">Safety:</span> Gloves, goggles, first-aid kits, supervised tool usage.</p>
            <p><span className="font-semibold">Trainers:</span> 2 experts (1 per module) + 1 logistics coordinator.</p>
          </div>
        </div>

        {/* Certification */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">7. Certification</h2>
          <div className="text-gray-700">
            <p><span className="font-semibold">Eligibility:</span> Minimum 80% attendance and minimum 9/20 marks.</p>
          </div>
        </div>

        {/* Promotion & Feedback */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">8. Promotion & Feedback</h2>
          <div className="text-gray-700 space-y-2">
            <p><span className="font-semibold">Marketing:</span> Social media campaigns, college partnerships, flyers.</p>
            <p><span className="font-semibold">Feedback Form:</span> Rate trainers, content, facilities; suggest improvements.</p>
          </div>
        </div>

        {/* Course Fee */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">9. Course Fee*</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Registration fee</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹50.00</td>
                  <td className="px-6 py-4 text-sm text-gray-500"></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Materials Cost</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹200.00</td>
                  <td className="px-6 py-4 text-sm text-gray-500"></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Trainers / Instructor</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹250.00</td>
                  <td className="px-6 py-4 text-sm text-gray-500">(@ ₹50 per day/trainee)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Certificates/Misc.</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹50.00</td>
                  <td className="px-6 py-4 text-sm text-gray-500"></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₹ 550.00</td>
                  <td className="px-6 py-4 text-sm text-gray-500"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-600">*Note: Special course fee concession (except Registration fee & Certificate fee) shall be provided to the students of <span className="font-bold">Kokrajhar Govt. College Students</span> for the ensuing summer internship programme-2025.</p>
        </div>

        {/* Contact Information */}
        <div className="bg-white shadow-sm rounded-lg p-8">
          <div className="text-center">
            {/* <p className="text-gray-700 mb-2">Sd/-</p> */}
            <p className="text-gray-700 mb-1">Sd/- Mrs. Reena Bodosa</p>
            {/* <p className="text-gray-700 mb-4">2. Mrs. Padma Basumatary</p> */}
            <p className="text-gray-700 font-semibold mb-4">Proprietor (s), SWRZEE ENTERPRISE</p>
            <p className="text-gray-700">Contact: enterprise@swrzee.in | Tel: +91 7002689522</p>
          </div>
        </div>
      </div>
    </main>
  );
}
