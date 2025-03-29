import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function FeedbackTab() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [resolutionComment, setResolutionComment] = useState('');
  const [resolvingId, setResolvingId] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/feedback`);
      setFeedbacks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch feedback submissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/feedback/resolve/${id}`, 
        resolutionComment
      );
      setResolvingId(null);
      setResolutionComment('');
      fetchFeedbacks();
    } catch (err) {
      setError('Failed to resolve feedback');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/feedback/delete/${id}`);
        fetchFeedbacks();
      } catch (err) {
        setError('Failed to delete feedback');
        console.error(err);
      }
    }
  };

  const filteredFeedbacks = filterType 
    ? feedbacks.filter(feedback => feedback.type === filterType) 
    : feedbacks;

  if (loading) return <div>Loading feedback submissions...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Feedback Submissions</h2>
        <div className="flex gap-2">
          <select 
            className="border rounded p-2"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="BUG_REPORT">Bug Report</option>
            <option value="FEATURE_REQUEST">Feature Request</option>
            <option value="GENERAL_FEEDBACK">General Feedback</option>
          </select>
          <Button onClick={fetchFeedbacks}>Refresh</Button>
        </div>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <p>No feedback submissions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFeedbacks.map(feedback => (
                <tr key={feedback.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{feedback.type}</td>
                  <td className="px-6 py-4">{feedback.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {feedback.fromUserId ? feedback.fromUserId : 'Anonymous'}
                    {feedback.fromUserEmail && <div className="text-sm text-gray-500">{feedback.fromUserEmail}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(feedback.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      feedback.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {feedback.resolved ? 'Resolved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {feedback.imageUrl && (
                      <a href={feedback.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Image
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {resolvingId === feedback.id ? (
                      <div className="flex flex-col space-y-2">
                        <Input
                          type="text"
                          value={resolutionComment}
                          onChange={(e) => setResolutionComment(e.target.value)}
                          placeholder="Resolution comment"
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleResolve(feedback.id)}>Confirm</Button>
                          <Button size="sm" variant="outline" onClick={() => setResolvingId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        {!feedback.resolved && (
                          <Button size="sm" onClick={() => setResolvingId(feedback.id)}>
                            Resolve
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(feedback.id)}>
                          Delete
                        </Button>
                      </div>
                    )}
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

export default FeedbackTab; 