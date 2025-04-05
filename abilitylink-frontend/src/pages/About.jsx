import React from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaUserShield,
  FaFileAlt,
  FaAccessibleIcon,
  FaTools,
  FaServer,
} from "react-icons/fa";
import { MdIntegrationInstructions, MdApi, MdSecurity } from "react-icons/md";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            About Inclusive Job Portal
          </h1>
          <p className="text-xl text-gray-600">
            Empowering job seekers with disabilities through accessible
            employment opportunities
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
            Our Mission
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium text-gray-800 mb-4">
                Accessibility First
              </h3>
              <p className="text-gray-600">
                We believe everyone deserves equal employment opportunities. Our
                platform is designed with accessibility at its core, ensuring
                job seekers with disabilities can navigate, apply, and showcase
                their skills without barriers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium text-gray-800 mb-4">
                Inclusive Hiring
              </h3>
              <p className="text-gray-600">
                We connect employers with talented individuals who bring unique
                perspectives and skills. Our tools help companies create more
                inclusive workplaces while helping candidates find jobs that
                accommodate their needs.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature Cards */}
            <FeatureCard
              icon={<FaUsers className="text-blue-500 text-3xl" />}
              title="User Profiles"
              description="Comprehensive profiles highlighting skills, experience, and accommodation needs with disability-specific fields."
            />
            <FeatureCard
              icon={<FaUserShield className="text-green-500 text-3xl" />}
              title="Accessibility Options"
              description="Screen reader support, high contrast mode, text resizing, and keyboard navigation."
            />
            <FeatureCard
              icon={<FaFileAlt className="text-purple-500 text-3xl" />}
              title="Document Management"
              description="Upload resumes, certifications, and portfolios with accessible preview options."
            />
            <FeatureCard
              icon={<FaAccessibleIcon className="text-red-500 text-3xl" />}
              title="Accommodation Guidance"
              description="Tools to help employers understand and implement workplace accommodations."
            />
            <FeatureCard
              icon={<FaTools className="text-yellow-500 text-3xl" />}
              title="Application Tools"
              description="Accessible application forms with options for alternative submission methods."
            />
            <FeatureCard
              icon={<FaServer className="text-indigo-500 text-3xl" />}
              title="Technical Specifications"
              description="Built with React, Node.js, Express, and MongoDB following WCAG 2.1 AA standards."
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
            Technical Documentation
          </h2>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
              <MdIntegrationInstructions className="mr-2" /> API Integration
            </h3>
            <p className="text-gray-600 mb-4">
              Our RESTful API allows for seamless integration with other HR
              systems and accessibility tools.
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <code className="text-sm text-gray-800">
                {`// Example: Fetching user profile\n`}
                {`GET /api/users/:id\n`}
                {`Authorization: Bearer <token>\n`}
                {`Content-Type: application/json`}
              </code>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
              <MdSecurity className="mr-2" /> Security & Privacy
            </h3>
            <p className="text-gray-600 mb-4">
              We prioritize the security and privacy of our users' data with
              industry-standard practices:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>End-to-end encryption for sensitive data</li>
              <li>Regular security audits and penetration testing</li>
              <li>GDPR and ADA compliance</li>
              <li>User-controlled data sharing preferences</li>
            </ul>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
            Getting Started
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium text-gray-800 mb-4">
                For Job Seekers
              </h3>
              <ol className="list-decimal pl-5 space-y-3 text-gray-600">
                <li>
                  Create your profile with disability-specific information
                </li>
                <li>Upload your resume and any certifications</li>
                <li>Specify your accommodation requirements</li>
                <li>Browse jobs with accessibility filters</li>
                <li>Apply using our accessible application forms</li>
              </ol>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium text-gray-800 mb-4">
                For Employers
              </h3>
              <ol className="list-decimal pl-5 space-y-3 text-gray-600">
                <li>Register your company account</li>
                <li>Post jobs with accessibility information</li>
                <li>Review applications with accessibility filters</li>
                <li>Use our accommodation suggestion tools</li>
                <li>Connect with diverse talent</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="text-center py-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ready to Get Started?
          </h2>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Join as Job Seeker
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Register as Employer
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-medium text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default About;
