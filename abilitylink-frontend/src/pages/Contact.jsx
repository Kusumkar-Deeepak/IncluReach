import React from 'react';
import { FaTools, FaHardHat, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { GiHammerNails } from 'react-icons/gi';
import { RiContactsBook2Fill } from 'react-icons/ri';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Construction Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 p-6 rounded-full">
              <FaTools className="text-yellow-500 text-5xl animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Contact Page Under Construction
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're working hard to build an amazing contact experience for you!
          </p>
        </div>

        {/* Construction Animation */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className="bg-gray-200 rounded-lg p-8 shadow-inner">
              <div className="flex space-x-6">
                <GiHammerNails className="text-gray-700 text-4xl animate-bounce" style={{ animationDelay: '0.1s' }} />
                <FaHardHat className="text-orange-500 text-4xl animate-bounce" style={{ animationDelay: '0.3s' }} />
                <GiHammerNails className="text-gray-700 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
            <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
              <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold shadow-md">
                COMING SOON
              </div>
            </div>
          </div>
        </div>

        {/* Temporary Contact Info */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-6">
            <div className="flex items-center">
              <RiContactsBook2Fill className="text-white text-3xl mr-3" />
              <h2 className="text-2xl font-bold text-white">Temporary Contact Options</h2>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 p-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <FaEnvelope className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Us</h3>
              <p className="text-gray-600">support@inclusivejobs.com</p>
              <a 
                href="mailto:support@inclusivejobs.com" 
                className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium"
              >
                Send Message
              </a>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                <FaPhoneAlt className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (800) 123-4567</p>
              <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9am-5pm EST</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full inline-block mb-4">
                <FaMapMarkerAlt className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Accessibility Way</p>
              <p className="text-gray-600">Boston, MA 02115</p>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">What We're Building</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Accessible contact form with screen reader support</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Live chat with sign language interpretation option</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">⌛</span>
              <span>Video call scheduling system with captioning</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">○</span>
              <span>AI-powered accessibility assistant</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
          <p className="mb-6 max-w-lg mx-auto">Get notified when our full contact system launches and receive accessibility tips</p>
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none text-gray-900"
            />
            <button className="bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-r-lg hover:bg-yellow-300 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;