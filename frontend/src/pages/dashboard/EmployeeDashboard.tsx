import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../hooks/useToast';
import type { Expense } from '../../types';

interface NewExpenseData {
  title: string;
  description: string;
  amount: number;
  currency: string;
  categoryId: string;
  expenseDate: string;
}

interface EmployeeDashboardProps {
  defaultAction?: 'upload' | 'new';
}

export function EmployeeDashboard({ defaultAction }: EmployeeDashboardProps = {}) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [newExpense, setNewExpense] = useState<NewExpenseData>({
    title: '',
    description: '',
    amount: 0,
    currency: 'INR',
    categoryId: '',
    expenseDate: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories] = useState([
    { id: '1', name: 'Food' },
    { id: '2', name: 'Travel' },
    { id: '3', name: 'Office Supplies' },
    { id: '4', name: 'Entertainment' },
    { id: '5', name: 'Training' }
  ]);
  
  const { success: showSuccess, error: showError } = useToast();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      
      // For development mode, use mock data first, then try API
      if (import.meta.env.DEV && user?.email === 'user1@gmail.com') {
        // Use backend API for user1@gmail.com
        try {
          const response = await fetch('/api/expenses', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setExpenses(data.data?.expenses || []);
            return;
          }
        } catch (error) {
          console.warn('API not available, using mock data');
        }
      }

      // Mock data for demo purposes
      const mockExpenses: Expense[] = [
        {
          id: '1',
          userId: user?.id || '',
          categoryId: '1',
          amount: 5000,
          currency: 'INR',
          description: 'Restaurant bill - Team lunch meeting',
          status: 'draft',
          receipts: [],
          approvals: [],
          createdAt: '2025-10-04T10:00:00Z',
          updatedAt: '2025-10-04T10:00:00Z',
          category: { id: '1', name: 'Food', companyId: 'company1', isActive: true, createdAt: '', updatedAt: '' },
          user: user!
        },
        {
          id: '2',
          userId: user?.id || '',
          categoryId: '1',
          amount: 33674,
          currency: 'INR',
          description: 'Coffee meeting - Client discussion over coffee',
          status: 'waiting_approval',
          receipts: [],
          approvals: [],
          submittedAt: '2025-10-03T10:00:00Z',
          createdAt: '2025-10-03T10:00:00Z',
          updatedAt: '2025-10-03T10:00:00Z',
          category: { id: '1', name: 'Food', companyId: 'company1', isActive: true, createdAt: '', updatedAt: '' },
          user: user!
        },
        {
          id: '3',
          userId: user?.id || '',
          categoryId: '2',
          amount: 500,
          currency: 'INR',
          description: 'Taxi fare - Airport to hotel transfer',
          status: 'approved',
          receipts: [],
          approvals: [
            {
              id: '1',
              expenseId: '3',
              approverId: 'manager1',
              approver: {
                id: 'manager1',
                name: 'Sarah',
                email: 'sarah@company.com',
                role: 'manager',
                company: { id: 'company1', name: 'Test Company', baseCurrency: 'USD', country: 'US' },
                isActive: true,
                createdAt: '2025-01-01T00:00:00Z',
                updatedAt: '2025-01-01T00:00:00Z'
              },
              action: 'approved',
              actionAt: '2025-10-02T12:44:00Z'
            }
          ],
          submittedAt: '2025-10-02T10:00:00Z',
          createdAt: '2025-10-02T10:00:00Z',
          updatedAt: '2025-10-02T12:44:00Z',
          category: { id: '2', name: 'Travel', companyId: 'company1', isActive: true, createdAt: '', updatedAt: '' },
          user: user!
        }
      ];
      setExpenses(mockExpenses);
    } catch (error) {
      showError('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExpense = async () => {
    if (!newExpense.title || !newExpense.amount || !newExpense.categoryId) {
      showError('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock submission - in real implementation, this would call the API
      const mockNewExpense: Expense = {
        id: String(Date.now()),
        userId: user?.id || '',
        categoryId: newExpense.categoryId,
        amount: newExpense.amount,
        currency: newExpense.currency,
        description: newExpense.description,
        status: 'draft',
        receipts: [],
        approvals: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: {
          id: newExpense.categoryId,
          name: categories.find(c => c.id === newExpense.categoryId)?.name || '',
          companyId: 'company1',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        user: user!
      };

      setExpenses(prev => [mockNewExpense, ...prev]);
      setIsNewExpenseModalOpen(false);
      setNewExpense({
        title: '',
        description: '',
        amount: 0,
        currency: 'INR',
        categoryId: '',
        expenseDate: new Date().toISOString().split('T')[0]
      });
      showSuccess('Expense created successfully!');
    } catch (error) {
      showError('Failed to create expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      processReceiptWithOCR(file);
    }
  };

  const processReceiptWithOCR = async (file: File) => {
    setIsProcessingOCR(true);
    try {
      // Mock OCR processing - in real implementation, this would call OCR service
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      // Mock extracted data
      const extractedData = {
        title: 'Restaurant Bill',
        description: 'Food expense from receipt',
        amount: Math.floor(Math.random() * 5000) + 100, // Random amount between 100-5100
        currency: 'INR',
        categoryId: '1', // Food category
        expenseDate: new Date().toISOString().split('T')[0]
      };

      setNewExpense(extractedData);
      showSuccess('Receipt processed! Please review the extracted details.');
    } catch (error) {
      showError('Failed to process receipt with OCR');
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'waiting_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'waiting_approval': return 'Waiting Approval';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'paid': return 'Paid';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Employee's View</h1>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            📄 Upload Receipt
          </Button>
          <Button
            onClick={() => setIsNewExpenseModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            ➕ New Expense
          </Button>
        </div>
      </div>

      {/* Expense Status Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="w-24 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-medium">5467 rs</span>
                </div>
                <p className="text-sm text-gray-600">To Submit</p>
              </div>
              
              <div className="flex-1 mx-4 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300"></div>
                <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2">
                  <div className="w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-yellow-600 font-medium">33674 rs</span>
                </div>
                <p className="text-sm text-gray-600">Waiting Approval</p>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300"></div>
                <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2">
                  <div className="w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-green-600 font-medium">500rs</span>
                </div>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p><strong>Upload:</strong> User should be able to upload a receipt from his computer</p>
              <p><strong>New:</strong> Or take a photo of the receipt, using OCR a new expense should get created with total amount and other necessary details.</p>
              <p><strong>Expenses which are submitted by employee but not finally approved by matching approval rules.</strong></p>
              <p><strong>Approved according to approval rule</strong></p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Expenses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card>
          <CardHeader title="Expense History" />
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading expenses...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{expense.description}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {new Date(expense.createdAt).toLocaleDateString('en-GB')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{expense.category.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{user?.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          {expense.status === 'approved' && expense.approvals?.[0] ? (
                            <div className="text-sm">
                              <p className="text-gray-900">Approver: {expense.approvals[0].approver.name}</p>
                              <p className="text-gray-500">Status: {expense.approvals[0].action}</p>
                              <p className="text-gray-500">
                                Time: {new Date(expense.approvals[0].actionAt).toLocaleString('en-GB')}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {expense.amount} {expense.currency}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(expense.status)}`}>
                            {getStatusText(expense.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="p-4 text-sm text-gray-500 bg-gray-50 border-t">
                  <p>
                    <strong>Note:</strong> The expenses which are still in draft state and not submitted by employee are
                    in To Submit stage. Once submitted the record should become readonly for employee and the Submit button 
                    should be invisible and status should be pending approval. Now, there should be a log history visible 
                    that which user approved/rejected your request at what time.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Upload Receipt Modal - OCR Processing */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setUploadedFile(null);
          setIsProcessingOCR(false);
        }}
        title="Upload Receipt for OCR Processing"
        size="xl"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              {!uploadedFile ? (
                <div>
                  <div className="text-4xl mb-4">📄</div>
                  <p className="text-lg font-medium text-gray-900 mb-2">Upload Receipt for OCR</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Take a photo or upload an image of your receipt. Our OCR system will automatically extract the details.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label
                    htmlFor="receipt-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                  >
                    📷 Choose File or Take Photo
                  </label>
                </div>
              ) : (
                <div>
                  {isProcessingOCR ? (
                    <div>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-lg font-medium text-gray-900">Processing Receipt...</p>
                      <p className="text-sm text-gray-600">Our OCR is extracting details from your receipt</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-green-600 text-4xl mb-4">✅</div>
                      <p className="text-lg font-medium text-gray-900">Receipt Processed!</p>
                      <p className="text-sm text-gray-600">Details have been extracted. Please review in the New Expense form.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadModalOpen(false);
                setUploadedFile(null);
                setIsProcessingOCR(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            {uploadedFile && !isProcessingOCR && (
              <Button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setIsNewExpenseModalOpen(true);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Review & Edit Details
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* New Expense Modal - Manual Entry */}
      <Modal
        isOpen={isNewExpenseModalOpen}
        onClose={() => {
          setIsNewExpenseModalOpen(false);
          setNewExpense({
            title: '',
            description: '',
            amount: 0,
            currency: 'INR',
            categoryId: '',
            expenseDate: new Date().toISOString().split('T')[0]
          });
        }}
        title="Create New Expense"
        size="xl"
      >
        <div className="space-y-6">
          <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setIsNewExpenseModalOpen(false);
                setIsUploadModalOpen(true);
              }}
            >
              📄 Attach Receipt
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600 px-4">
              <span className="bg-gray-200 px-2 py-1 rounded">Draft</span>
              <span>→</span>
              <span className="bg-yellow-200 px-2 py-1 rounded">Waiting approval</span>
              <span>→</span>
              <span className="bg-green-200 px-2 py-1 rounded">Approved</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Input
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                placeholder="Enter description"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Date
              </label>
              <Input
                type="date"
                value={newExpense.expenseDate}
                onChange={(e) => setNewExpense({ ...newExpense, expenseDate: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newExpense.categoryId}
                onChange={(e) => setNewExpense({ ...newExpense, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid by
              </label>
              <Input
                value={user?.name || ''}
                disabled
                className="bg-gray-50 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total amount in <span className="underline">currency selection</span> ▽
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={newExpense.amount || ''}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="567"
                  className="flex-1"
                />
                <select
                  value={newExpense.currency}
                  onChange={(e) => setNewExpense({ ...newExpense, currency: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="INR">₹</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                </select>
              </div>
              <p className="text-xs text-red-500 mt-2">
                Employee can submit expense in any currency (currency in which he spent the money in receipt).
                In manager's approval dashboard, the amount should get auto-converted to base currency of the company
                with real-time today's currency conversion rate.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Additional remarks"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-2">Approval History</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Approver:</span>
                <p className="text-gray-600">Sarah</p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <p className="text-gray-600">Approved</p>
              </div>
              <div>
                <span className="font-medium">Time:</span>
                <p className="text-gray-600">12:44 4th Oct, 2025</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsNewExpenseModalOpen(false);
                setNewExpense({
                  title: '',
                  description: '',
                  amount: 0,
                  currency: 'INR',
                  categoryId: '',
                  expenseDate: new Date().toISOString().split('T')[0]
                });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitExpense}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}