import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useExpenses } from '../../hooks/useExpenses';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';
export function ExpensesList() {
  const { user } = useAuth();
  const { expenses, isLoading, error, fetchExpenses } = useExpenses();
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    return expense.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const color = getStatusColor(status);
    const colorClasses = {
      gray: 'bg-gray-100 text-gray-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      blue: 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading expenses</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchExpenses}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {['all', 'draft', 'waiting_approval', 'approved', 'rejected', 'paid'].map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? "You haven't submitted any expenses yet."
                  : `No expenses with status "${filter.replace('_', ' ')}" found.`
                }
              </p>
              {filter === 'all' && (
                <Button>Create New Expense</Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {expense.category.name}
                        </h3>
                        {getStatusBadge(expense.status)}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{expense.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Amount:</span>
                          <div className="text-xl font-bold text-gray-900">
                            {formatCurrency(expense.amount, expense.currency)}
                          </div>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-500">Date:</span>
                          <div>{formatDate(expense.createdAt)}</div>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-500">Receipts:</span>
                          <div>{expense.receipts.length} file(s)</div>
                        </div>
                        
                        {expense.submittedAt && (
                          <div>
                            <span className="font-medium text-gray-500">Submitted:</span>
                            <div>{formatDate(expense.submittedAt)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      
                      {expense.status === 'draft' && (
                        <>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm">
                            Submit
                          </Button>
                        </>
                      )}
                      
                      {user?.role === 'manager' && expense.status === 'waiting_approval' && (
                        <>
                          <Button size="sm" variant="outline">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
