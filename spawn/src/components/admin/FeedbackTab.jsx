import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ChevronUp, ChevronDown } from "lucide-react";

// Helper function to format feedback type
const formatFeedbackType = (type) => {
  switch (type) {
    case 'BUG':
      return 'Bug Report';
    case 'FEATURE_REQUEST':
      return 'Feature Request';
    case 'GENERAL_FEEDBACK':
      return 'General Feedback';
    default:
      return type;
  }
};

// Helper function to format feedback status
const formatFeedbackStatus = (status) => {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'RESOLVED':
      return 'Resolved';
    default:
      return status;
  }
};

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800';
    case 'RESOLVED':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

function FeedbackTab() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [resolutionComment, setResolutionComment] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [inProgressDialogOpen, setInProgressDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'submittedAt', direction: 'desc' });

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

  const openResolveDialog = (feedback) => {
    setSelectedFeedback(feedback);
    setResolutionComment(feedback.resolutionComment || '');
    setResolveDialogOpen(true);
  };

  const openInProgressDialog = (feedback) => {
    setSelectedFeedback(feedback);
    setResolutionComment(feedback.resolutionComment || '');
    setInProgressDialogOpen(true);
  };

  const handleResolve = async () => {
    if (!selectedFeedback) return;
    
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/feedback/resolve/${selectedFeedback.id}`, 
        resolutionComment,
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      );
      
      setResolveDialogOpen(false);
      setResolutionComment('');
      setSelectedFeedback(null);
      fetchFeedbacks();
      toast({
        title: "Feedback resolved",
        description: "The feedback has been successfully resolved."
      });
    } catch (err) {
      setError('Failed to resolve feedback');
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to resolve feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMarkInProgress = async () => {
    if (!selectedFeedback) return;
    
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/feedback/in-progress/${selectedFeedback.id}`, 
        resolutionComment,
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      );
      
      setInProgressDialogOpen(false);
      setResolutionComment('');
      setSelectedFeedback(null);
      fetchFeedbacks();
      toast({
        title: "Feedback status updated",
        description: "The feedback has been marked as in progress."
      });
    } catch (err) {
      setError('Failed to update feedback status');
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update feedback status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/feedback/delete/${id}`);
        fetchFeedbacks();
        toast({
          title: "Feedback deleted",
          description: "The feedback has been successfully deleted."
        });
      } catch (err) {
        setError('Failed to delete feedback');
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to delete feedback. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort the feedback items
  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
    if (!a[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (!b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;

    let comparison = 0;
    
    if (sortConfig.key === 'submittedAt') {
      // Date comparison
      comparison = new Date(a[sortConfig.key]) - new Date(b[sortConfig.key]);
    } else if (sortConfig.key === 'status') {
      // Status comparison
      const statusOrder = { 'PENDING': 0, 'IN_PROGRESS': 1, 'RESOLVED': 2 };
      comparison = statusOrder[a[sortConfig.key]] - statusOrder[b[sortConfig.key]];
    } else if (sortConfig.key === 'type') {
      // Compare formatted feedback type
      comparison = formatFeedbackType(a[sortConfig.key]).localeCompare(formatFeedbackType(b[sortConfig.key]));
    } else {
      // String comparison
      comparison = String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]));
    }

    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  // Apply both type and status filters
  const filteredFeedbacks = sortedFeedbacks.filter(feedback => {
    const matchesType = !filterType || feedback.type === filterType;
    const matchesStatus = !statusFilter || feedback.status === statusFilter;
    return matchesType && matchesStatus;
  });

  // Helper function for table header
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return null;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="inline h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="inline h-4 w-4 ml-1" />
    );
  };

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
            <option value="BUG">Bug Report</option>
            <option value="FEATURE_REQUEST">Feature Request</option>
            <option value="GENERAL_FEEDBACK">General Feedback</option>
          </select>
          <select 
            className="border rounded p-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
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
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('type')}
                >
                  Type {getSortIcon('type')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('message')}
                >
                  Message {getSortIcon('message')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('firstName')}
                >
                  User {getSortIcon('firstName')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('submittedAt')}
                >
                  Submitted {getSortIcon('submittedAt')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('status')}
                >
                  Status {getSortIcon('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFeedbacks.map(feedback => (
                <tr key={feedback.id} className={feedback.status === 'RESOLVED' ? "bg-green-50" : feedback.status === 'IN_PROGRESS' ? "bg-blue-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">{formatFeedbackType(feedback.type)}</td>
                  <td className="px-6 py-4">{feedback.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {feedback.firstName && feedback.lastName 
                      ? `${feedback.firstName} ${feedback.lastName}`
                      : feedback.fromUserId ? 'User ID: ' + feedback.fromUserId 
                      : 'Anonymous'}
                    {feedback.fromUserEmail && <div className="text-sm text-gray-500">{feedback.fromUserEmail}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {feedback.submittedAt 
                      ? new Date(feedback.submittedAt).toLocaleString()
                      : 'Invalid Date'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                      {formatFeedbackStatus(feedback.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {feedback.resolutionComment ? (
                      <div className="text-sm">
                        {feedback.resolutionComment}
                      </div>
                    ) : feedback.status === 'RESOLVED' ? (
                      <div className="text-sm text-gray-500 italic">No comment provided</div>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {feedback.imageUrl && (
                      <a href={feedback.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Image
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      {feedback.status === 'PENDING' && (
                        <>
                          <Button size="sm" onClick={() => openInProgressDialog(feedback)}>
                            In Progress
                          </Button>
                          <Button size="sm" onClick={() => openResolveDialog(feedback)}>
                            Resolve
                          </Button>
                        </>
                      )}
                      {feedback.status === 'IN_PROGRESS' && (
                        <>
                          <Button size="sm" onClick={() => openResolveDialog(feedback)}>
                            Resolve
                          </Button>
                        </>
                      )}
                      {feedback.status === 'RESOLVED' && (
                        <Button size="sm" variant="outline" onClick={() => openResolveDialog(feedback)}>
                          Update Resolution
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(feedback.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedFeedback && selectedFeedback.status === 'RESOLVED' 
                ? "Update Resolution" 
                : "Resolve Feedback"}
            </DialogTitle>
            <DialogDescription>
              {selectedFeedback && selectedFeedback.status === 'RESOLVED' 
                ? "Update the resolution comment for this feedback." 
                : "Add a resolution comment to explain how this feedback was addressed."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Feedback Message:</p>
                <p className="text-sm border p-2 rounded bg-gray-50">{selectedFeedback.message}</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="resolution-comment" className="text-sm font-medium">
                  Resolution Comment:
                </label>
                <Textarea 
                  id="resolution-comment"
                  value={resolutionComment} 
                  onChange={(e) => setResolutionComment(e.target.value)}
                  placeholder="Explain how this issue was resolved..."
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setResolveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleResolve}
            >
              {selectedFeedback && selectedFeedback.status === 'RESOLVED' ? "Update" : "Resolve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={inProgressDialogOpen} onOpenChange={setInProgressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as In Progress</DialogTitle>
            <DialogDescription>
              Mark this feedback as in progress and optionally add a comment about what's being done.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Feedback Message:</p>
                <p className="text-sm border p-2 rounded bg-gray-50">{selectedFeedback.message}</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="progress-comment" className="text-sm font-medium">
                  Comment (Optional):
                </label>
                <Textarea 
                  id="progress-comment"
                  value={resolutionComment} 
                  onChange={(e) => setResolutionComment(e.target.value)}
                  placeholder="Enter details about what's being done..."
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setInProgressDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleMarkInProgress}
            >
              Mark In Progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FeedbackTab; 