import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../hooks/useToast';
import { expenseApi } from '../../api/expenses';
import type { Expense } from '../../types';

interface ApprovalRequest {
  _id: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  expenseDate: string | Date;
  status: string;
  employeeName: string;
  employeeEmail: string;
  category: string;
  submittedAt?: string | Date;
  approvedAt?: string | Date;
  rejectedAt?: string | Date;
  rejectionReason?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export function ManagerDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [pendingRequests, setPendingRequests] = useState<ApprovalRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<ApprovalRequest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  // Statistics
  const [stats, setStats] = useState({
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    fetchApprovalRequests();
  }, []);

  const fetchApprovalRequests = async () => {
    try {
      setLoading(true);
      const response = await expenseApi.getApprovalRequests();

      if (response.success) {
        const data = response.data;
        setPendingRequests(data.pending || []);
        setApprovedRequests(data.approved || []);
        setRejectedRequests(data.rejected || []);
        
        // Calculate statistics
        const totalPending = data.pending?.length || 0;
        const totalApproved = data.approved?.length || 0;
        const totalRejected = data.rejected?.length || 0;
        const totalAmount = data.pending?.reduce((sum: number, req: ApprovalRequest) => sum + req.amount, 0) || 0;
        
        setStats({
          totalPending,
          totalApproved,
          totalRejected,
          totalAmount,
        });
      } else {
        showToast(response.message || 'Failed to fetch approval requests', { type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching approval requests:', error);
      showToast('Failed to fetch approval requests', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      setProcessingAction(requestId);
      const response = await expenseApi.approveExpenseRequest(requestId);

      if (response.success) {
        showToast('Expense approved successfully', { type: 'success' });
        fetchApprovalRequests(); // Refresh the list
        setIsDetailsModalOpen(false);
      } else {
        showToast(response.message || 'Failed to approve expense', { type: 'error' });
      }
    } catch (error) {
      console.error('Error approving expense:', error);
      showToast('Failed to approve expense', { type: 'error' });
    } finally {
      setProcessingAction(null);
    }
  };

  const handleReject = async (requestId: string, reason: string) => {
    try {
      setProcessingAction(requestId);
      const response = await expenseApi.rejectExpenseRequest(requestId, reason);

      if (response.success) {
        showToast('Expense rejected successfully', { type: 'success' });
        fetchApprovalRequests(); // Refresh the list
        setIsDetailsModalOpen(false);
        setIsRejectModalOpen(false);
        setRejectionReason('');
      } else {
        showToast(response.message || 'Failed to reject expense', { type: 'error' });
      }
    } catch (error) {
      console.error('Error rejecting expense:', error);
      showToast('Failed to reject expense', { type: 'error' });
    } finally {
      setProcessingAction(null);
    }
  };

  const openDetailsModal = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const openRejectModal = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setIsRejectModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600">Review and approve expense requests from your team</p>
        </div>
        <Button
          onClick={fetchApprovalRequests}
          variant="outline"
        >
          🔄 Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.totalPending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalApproved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalRejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl">❌</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader title="Pending Approval Requests" />
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📋</span>
              </div>
              <p className="text-gray-500">No pending approval requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{request.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>👤 {request.employeeName}</span>
                        <span>📅 {formatDate(request.expenseDate)}</span>
                        <span>🏷️ {request.category}</span>
                        <span className="font-medium text-gray-900">{formatCurrency(request.amount, request.currency)}</span>
                      </div>
                      {request.description && (
                        <p className="text-sm text-gray-600 mt-2">{request.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDetailsModal(request)}
                      >
                        👁️ View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request._id)}
                        disabled={processingAction === request._id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {processingAction === request._id ? '⏳' : '✅'} Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openRejectModal(request)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        ❌ Reject
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="✅ Recently Approved" />
          <CardContent>
            {approvedRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No approved requests</p>
            ) : (
              <div className="space-y-3">
                {approvedRequests.slice(0, 5).map((request) => (
                  <div key={request._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{request.title}</p>
                      <p className="text-sm text-gray-600">{request.employeeName}</p>
                    </div>
                    <span className="font-medium text-green-600">{formatCurrency(request.amount, request.currency)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="❌ Recently Rejected" />
          <CardContent>
            {rejectedRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No rejected requests</p>
            ) : (
              <div className="space-y-3">
                {rejectedRequests.slice(0, 5).map((request) => (
                  <div key={request._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{request.title}</p>
                      <p className="text-sm text-gray-600">{request.employeeName}</p>
                    </div>
                    <span className="font-medium text-red-600">{formatCurrency(request.amount, request.currency)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Expense Request Details"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <p className="text-gray-900">{selectedRequest.employeeName}</p>
                <p className="text-sm text-gray-600">{selectedRequest.employeeEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-gray-900">{selectedRequest.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <p className="text-gray-900">{selectedRequest.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedRequest.amount, selectedRequest.currency)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expense Date</label>
                <p className="text-gray-900">{formatDate(selectedRequest.expenseDate)}</p>
              </div>
            </div>
            
            {selectedRequest.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.description}</p>
              </div>
            )}

            {selectedRequest.status === 'submitted' && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleApprove(selectedRequest._id)}
                  disabled={processingAction === selectedRequest._id}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {processingAction === selectedRequest._id ? '⏳ Processing...' : '✅ Approve Request'}
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    openRejectModal(selectedRequest);
                  }}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                >
                  ❌ Reject Request
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Rejection Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectionReason('');
        }}
        title="Reject Expense Request"
        size="md"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div>
              <p className="text-gray-900 mb-2">
                Are you sure you want to reject the expense request "{selectedRequest.title}" 
                by {selectedRequest.employeeName}?
              </p>
              <p className="text-sm text-gray-600">
                Amount: {formatCurrency(selectedRequest.amount, selectedRequest.currency)}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectionReason('');
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleReject(selectedRequest._id, rejectionReason)}
                disabled={!rejectionReason.trim() || processingAction === selectedRequest._id}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {processingAction === selectedRequest._id ? '⏳ Processing...' : '❌ Reject Request'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}