import React from 'react';
import { FaShieldAlt, FaBalanceScale, FaUniversalAccess } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LegalDocuments = () => {
  const sections = [
    {
      id: 'privacy',
      icon: <FaShieldAlt className="text-blue-500 text-3xl" />,
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: April 05, 2025',
      content: [
        {
          title: 'Information We Collect',
          text: 'We collect personal information you provide when creating an account, applying for jobs, or contacting us. This may include name, email, disability information (voluntarily provided), and professional credentials.'
        },
        {
          title: 'How We Use Information',
          text: 'Your data enables job matching, improves accessibility features, and personalizes your experience. We never sell your data to third parties.'
        },
        {
          title: 'Data Security',
          text: 'We implement industry-standard encryption, regular security audits, and strict access controls to protect your information.'
        }
      ]
    },
    {
      id: 'terms',
      icon: <FaBalanceScale className="text-green-500 text-3xl" />,
      title: 'Terms of Service',
      lastUpdated: 'Effective: April 05, 2025',
      content: [
        {
          title: 'Account Responsibilities',
          text: 'You must provide accurate information and maintain account security. Prohibited activities include discrimination, harassment, or posting fraudulent job listings.'
        },
        {
          title: 'Intellectual Property',
          text: 'All content on IncluReach is protected by copyright laws. Job postings may be shared only through our platform tools.'
        },
        {
          title: 'Termination',
          text: 'We reserve the right to suspend accounts violating these terms or engaging in harmful behavior to our community.'
        }
      ]
    },
    {
      id: 'accessibility',
      icon: <FaUniversalAccess className="text-purple-500 text-3xl" />,
      title: 'Accessibility Statement',
      lastUpdated: 'Updated: April 05, 2025',
      content: [
        {
          title: 'Commitment',
          text: 'IncluReach is committed to WCAG 2.1 AA standards. We continuously improve accessibility for users with diverse disabilities.'
        },
        {
          title: 'Features',
          text: 'Screen reader optimization, keyboard navigation, adjustable text sizes, high contrast mode, and ARIA landmarks throughout.'
        },
        {
          title: 'Feedback',
          text: 'Contact our accessibility team at accessibility@IncluReach.com to report issues or suggest improvements.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal & Accessibility</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparency and accessibility are at the core of our mission to connect talent with opportunity.
          </p>
        </motion.div>

        {/* Document Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {sections.map((section) => (
            <a 
              key={section.id}
              href={`#${section.id}`}
              className="px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition flex items-center gap-2"
            >
              {section.icon}
              <span>{section.title}</span>
            </a>
          ))}
        </div>

        {/* Documents Content */}
        <div className="space-y-16">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className={`p-6 ${index % 2 === 0 ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                    <p className="text-gray-500">{section.lastUpdated}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="space-y-8">
                  {section.content.map((item, i) => (
                    <div key={i} className="group">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="w-4 h-4 bg-blue-500 rounded-full mr-3 group-hover:bg-blue-600 transition"></span>
                        {item.title}
                      </h3>
                      <p className="text-gray-600 pl-7">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Need Further Assistance?</h3>
          <p className="mb-6 max-w-lg mx-auto">Our team is happy to answer any questions about our policies or accessibility features.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="mailto:legal@IncluReach.com" 
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition"
            >
              Email Legal Team
            </a>
            <a 
              href="mailto:accessibility@IncluReach.com" 
              className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition"
            >
              Accessibility Support
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalDocuments;