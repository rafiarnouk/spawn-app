import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import FeedbackTab from '../components/admin/FeedbackTab';
import BetaSignupsTab from '../components/admin/BetaSignupsTab';
import ReportsTab from '../components/admin/ReportsTab';

function Admin() {
  const [activeTab, setActiveTab] = useState('feedback');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Spawn Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'feedback'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Feedback Submissions
            </button>
            <button
              onClick={() => setActiveTab('beta')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'beta'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Beta Access Signups
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Content Reports
            </button>
          </nav>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === 'feedback' && <FeedbackTab />}
          {activeTab === 'beta' && <BetaSignupsTab />}
          {activeTab === 'reports' && <ReportsTab />}
        </div>
      </main>
    </div>
  );
}

export default Admin; 