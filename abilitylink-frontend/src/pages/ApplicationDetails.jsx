import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const ApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data } = await api.get(`/dashboard/applications/${id}`);
        setApplication(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch application details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      Applied: 'bg-blue-100 text-blue-800',
      Interview: 'bg-purple-100 text-purple-800',
      Offer: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const handleWithdraw = async () => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await api.delete(`/dashboard/applications/${id}`);
        navigate('/applications');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to withdraw application');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/applications"
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to applications
          </Link>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {application.job.title}
                  </h1>
                  <p className="text-gray-600">
                    {application.job.company} • {application.job.location} • {application.job.remote ? 'Remote' : 'On-site'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(application.status)}
                  {application.status !== 'Rejected' && (
                    <button
                      onClick={handleWithdraw}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Applied Date</h3>
                  <p>{new Date(application.appliedDate).toLocaleDateString()}</p>
                </div>
                {application.status === 'Interview' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Interview Date</h3>
                    <p>
                      {application.updates.find(u => u.type === 'Interview')?.date 
                        ? new Date(application.updates.find(u => u.type === 'Interview').date).toLocaleString()
                        : 'Not scheduled yet'}
                    </p>
                  </div>
                )}
                {application.status === 'Offer' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Offer Received</h3>
                    <p>
                      {application.updates.find(u => u.type === 'StatusChange' && u.message.includes('Offer'))?.date 
                        ? new Date(application.updates.find(u => u.type === 'StatusChange' && u.message.includes('Offer')).date).toLocaleDateString()
                        : 'Recently'}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500">Job Description</h3>
                <p className="mt-1 text-gray-700">
                  {application.job.description || 'No description available'}
                </p>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Application Timeline</h2>
              <div className="space-y-4">
                {application.updates.length > 0 ? (
                  [...application.updates].reverse().map((update, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          update.type === 'StatusChange' ? 'bg-blue-500' : 
                          update.type === 'Interview' ? 'bg-purple-500' : 'bg-gray-500'
                        }`}></div>
                        {index < application.updates.length - 1 && (
                          <div className="w-px h-full bg-gray-200"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium">
                          {update.type === 'StatusChange' 
                            ? `Status changed to ${update.message.split('to ')[1] || update.message}`
                            : update.type === 'Interview'
                              ? 'Interview scheduled'
                              : update.message}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(update.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No updates yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApplicationDetails;