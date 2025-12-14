import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {authenticatedRequest} from "@/lib/authService.js";

function ReportsTab() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterReportType, setFilterReportType] = useState('');
  const [filterContentType, setFilterContentType] = useState('');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      // Build query string with filters
      let url = `${import.meta.env.VITE_API_URL}/api/v1/reports`;
      const params = [];

      if (filterReportType) {
        params.push(`reportType=${filterReportType}`);
      }
      
      if (filterContentType) {
        params.push(`contentType=${filterContentType}`);
      }
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const response = await authenticatedRequest(url);
      const data = await response.json()
      setReports(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reports. This feature may still be in development.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterReportType, filterContentType]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleResolve = async (reportId, resolution) => {
    if (!resolution) {
      setError('Please select a resolution action');
      return;
    }
    
    try {
      await authenticatedRequest(`${import.meta.env.VITE_API_URL}/api/v1/reports/${reportId}?resolution=${resolution}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            }
          });
      await fetchReports();
    } catch (err) {
      setError('Failed to resolve report');
      console.error(err);
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await authenticatedRequest(`${import.meta.env.VITE_API_URL}/api/v1/reports/${reportId}`, {method: "DELETE"})
        await fetchReports();
      } catch (err) {
        setError('Failed to delete report');
        console.error(err);
      }
    }
  };

  const resetFilters = () => {
    setFilterReportType('');
    setFilterContentType('');
  };

  if (loading) return <div>Loading reports...</div>;
  if (error) return (
    <div>
      <div className="text-red-500 mb-4">{error}</div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Content Reports</h2>
        <Button onClick={fetchReports}>Retry</Button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Content Reports</h2>
        <Button onClick={fetchReports}>Refresh</Button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select 
              value={filterReportType}
              onChange={(e) => setFilterReportType(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">All Types</option>
              <option value="SPAM">Spam</option>
              <option value="HARASSMENT">Harassment</option>
              <option value="INAPPROPRIATE">Inappropriate</option>
              <option value="MISINFORMATION">Misinformation</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
            <select 
              value={filterContentType}
              onChange={(e) => setFilterContentType(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">All Content</option>
              <option value="USER">User</option>
              <option value="ACTIVITY">Activity</option>
              <option value="COMMENT">Comment</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button onClick={resetFilters} variant="outline">Reset Filters</Button>
          <Button onClick={() => fetchReports()}>Apply Filters</Button>
        </div>
      </div>

      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map(report => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{report.reportType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.contentType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.reporterId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{report.contentOwnerId}</td>
                  <td className="px-6 py-4">{report.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'BAN' ? 'bg-red-100 text-red-800' : 
                      report.status === 'SUSPENSION' ? 'bg-orange-100 text-orange-800' : 
                      report.status === 'WARN' ? 'bg-yellow-100 text-yellow-800' : 
                      report.status === 'FALSE' ? 'bg-gray-100 text-gray-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {report.status === 'PENDING' && (
                      <div className="flex flex-col space-y-2">
                        <select 
                          className="border rounded p-1 text-sm"
                          onChange={(e) => handleResolve(report.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Select Action</option>
                          <option value="FALSE">Mark as False Report</option>
                          <option value="WARN">Issue Warning</option>
                          <option value="SUSPENSION">Suspend User</option>
                          <option value="BAN">Ban User</option>
                        </select>
                      </div>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(report.id)} className="mt-2">
                      Delete
                    </Button>
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

export default ReportsTab; 