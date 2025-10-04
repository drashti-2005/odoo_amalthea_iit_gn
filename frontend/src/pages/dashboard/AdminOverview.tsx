import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface DashboardStats {
  totalExpenses: number;
  pendingApprovals: number;
  approvedThisMonth: number;
  rejectedCount: number;
  totalUsers: number;
  activeCategories: number;
}

interface AdminOverviewProps {
  onNavigateToUsers: () => void;
}

export function AdminOverview({ onNavigateToUsers }: AdminOverviewProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalExpenses: 0,
    pendingApprovals: 0,
    approvedThisMonth: 0,
    rejectedCount: 0,
    totalUsers: 0,
    activeCategories: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalExpenses: 156,
      pendingApprovals: 23,
      approvedThisMonth: 89,
      rejectedCount: 8,
      totalUsers: 45,
      activeCategories: 12,
    });
    setIsLoading(false);
  }, []);

  const statCards = [
    {
      title: 'Total Expenses',
      value: stats.totalExpenses,
      change: '+12%',
      changeType: 'increase' as const,
      icon: '📊',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      change: '-5%',
      changeType: 'decrease' as const,
      icon: '⏳',
    },
    {
      title: 'Approved This Month',
      value: stats.approvedThisMonth,
      change: '+18%',
      changeType: 'increase' as const,
      icon: '✅',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: '+8%',
      changeType: 'increase' as const,
      icon: '👥',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Dashboard Overview</h2>
          <p className="opacity-90">Here's what's happening with your expense management system today.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Cards and Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={onNavigateToUsers}
                >
                  <span className="mr-3">👥</span>
                  Manage Users
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-3">⚙️</span>
                  Configure Rules
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-3">📊</span>
                  View Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-3">📂</span>
                  Manage Categories
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader title="Recent Activity" />
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Expense approved', user: 'John Doe', amount: '$234.50', time: '2 hours ago' },
                  { action: 'New user registered', user: 'Jane Smith', amount: '', time: '4 hours ago' },
                  { action: 'Rule updated', user: 'Admin', amount: '', time: '1 day ago' },
                  { action: 'Expense rejected', user: 'Bob Wilson', amount: '$89.99', time: '2 days ago' },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">
                        {activity.user} {activity.amount && `• ${activity.amount}`}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader title="Expense Trends" />
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}