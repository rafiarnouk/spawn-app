import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function BetaSignupsTab() {
  const [signups, setSignups] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [subscribedFilter, setSubscribedFilter] = useState('all');
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    fetchBetaSignups();
    fetchEmails();
  }, []);

  const fetchBetaSignups = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/betaAccessSignUp/records`);
      setSignups(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch beta signups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/betaAccessSignUp/emails`);
      setEmails(response.data);
    } catch (err) {
      console.error('Failed to fetch emails', err);
    }
  };

  const copyEmailsToClipboard = () => {
    const emailsText = filteredSignups.map(signup => signup.email).join(',\n');
    navigator.clipboard.writeText(emailsText).then(
      () => {
        setCopySuccess('Emails copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 3000);
      },
      () => {
        setCopySuccess('Failed to copy emails');
      }
    );
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSubscribedFilter('all');
  };

  const filteredSignups = signups.filter(signup => {
    const signupDate = new Date(signup.createdAt);
    const passesDateFilter = (!startDate || signupDate >= startDate) && 
                             (!endDate || signupDate <= endDate);
    
    const passesSubscribedFilter = 
      subscribedFilter === 'all' || 
      (subscribedFilter === 'subscribed' && signup.hasSubscribedToNewsletter) ||
      (subscribedFilter === 'not-subscribed' && !signup.hasSubscribedToNewsletter);
    
    return passesDateFilter && passesSubscribedFilter;
  });

  if (loading) return <div>Loading beta signups...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Beta Access Signups</h2>
        <div>
          <p>Total Signups: <span className="font-semibold">{signups.length}</span></p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="w-full border rounded p-2"
              placeholderText="From date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="w-full border rounded p-2"
              placeholderText="To date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Newsletter Subscription</label>
            <select 
              value={subscribedFilter}
              onChange={(e) => setSubscribedFilter(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="all">All</option>
              <option value="subscribed">Subscribed</option>
              <option value="not-subscribed">Not Subscribed</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button onClick={resetFilters} variant="outline">Reset Filters</Button>
          <div className="flex gap-2">
            <Button onClick={copyEmailsToClipboard}>
              Copy Filtered Emails
            </Button>
            <Button onClick={fetchBetaSignups}>Refresh</Button>
          </div>
        </div>
        
        {copySuccess && (
          <div className="mt-2 text-green-600 text-sm">{copySuccess}</div>
        )}
      </div>

      {filteredSignups.length === 0 ? (
        <p>No beta signups found matching your filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Newsletter</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSignups.map(signup => (
                <tr key={signup.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{signup.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(signup.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      signup.hasSubscribedToNewsletter ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {signup.hasSubscribedToNewsletter ? 'Subscribed' : 'Not Subscribed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BetaSignupsTab; 