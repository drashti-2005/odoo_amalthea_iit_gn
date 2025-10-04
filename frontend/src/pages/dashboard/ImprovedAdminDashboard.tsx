import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  amount?: string;
  time: string;
  type: 'approval' | 'user' | 'expense' | 'system';
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalExpenses: 0,
    pendingApprovals: 0,
    approvedThisMonth: 0,
    rejectedCount: 0,
    totalUsers: 0,
    activeCategories: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
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
    
    setRecentActivity([
      { id: '1', action: 'Expense approved', user: 'John Doe', amount: '$234.50', time: '2 hours ago', type: 'approval' },
      { id: '2', action: 'New user registered', user: 'Jane Smith', time: '4 hours ago', type: 'user' },
      { id: '3', action: 'Rule updated', user: 'Admin', time: '1 day ago', type: 'system' },
      { id: '4', action: 'Expense rejected', user: 'Bob Wilson', amount: '$89.99', time: '2 days ago', type: 'approval' },
      { id: '5', action: 'Category created', user: 'Admin', time: '3 days ago', type: 'system' },
    ]);
    
    setIsLoading(false);
  }, []);

  const statCards = [
    {
      title: 'Total Expenses',
      value: stats.totalExpenses,
      change: '+12%',
      changeType: 'increase' as const,
      icon: '📊',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      change: '-5%',
      changeType: 'decrease' as const,
      icon: '⏳',
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Approved This Month',
      value: stats.approvedThisMonth,
      change: '+18%',
      changeType: 'increase' as const,
      icon: '✅',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Rejected',
      value: stats.rejectedCount,
      change: '-2%',
      changeType: 'decrease' as const,
      icon: '❌',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: '+8%',
      changeType: 'increase' as const,
      icon: '👥',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Active Categories',
      value: stats.activeCategories,
      change: '+2%',
      changeType: 'increase' as const,
      icon: '📂',
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
  ];

  const quickActions = [
    { title: 'Manage Users', icon: '👥', href: '/users', description: 'Add, edit, and manage user accounts' },
    { title: 'Approval Rules', icon: '⚙️', href: '/rules', description: 'Configure expense approval workflows' },
    { title: 'View Reports', icon: '📈', href: '/reports', description: 'Analyze expense data and trends' },
    { title: 'Categories', icon: '📂', href: '/categories', description: 'Organize expense categories' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approval': return '✅';
      case 'user': return '👤';
      case 'expense': return '💰';
      case 'system': return '⚙️';
      default: return '📋';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <div className="animate-pulse p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your expense management system today.
          </p>
        </div>
        <div className="lg:text-right">
          <p className="text-sm text-gray-500 mb-1">Company</p>
          <p className="text-lg font-semibold text-gray-900">{user?.company?.name}</p>
          <p className="text-sm text-gray-500">Base Currency: {user?.company?.baseCurrency}</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <Card className="h-full border-l-4 border-l-transparent hover:border-l-primary-500 transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'increase' ? '↗️' : '↘️'} {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">vs last month</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-3">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Link
                      to={action.href}
                      className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                          {action.icon}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-primary-700">
                            {action.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader 
              title="Recent Activity"
              action={
                <Button variant="outline" size="sm">
                  View All
                </Button>
              }
            />
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">{getActivityIcon(activity.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.user} {activity.amount && `• ${activity.amount}`}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 flex-shrink-0">
                      {activity.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader title="System Performance" />
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="h-32 flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">94%</div>
                    <div className="text-sm text-blue-600">Processing Speed</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Average expense processing time</p>
              </div>
              <div className="text-center">
                <div className="h-32 flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 rounded-lg mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">99.2%</div>
                    <div className="text-sm text-green-600">Uptime</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">System availability this month</p>
              </div>
              <div className="text-center">
                <div className="h-32 flex items-center justify-center bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">4.8</div>
                    <div className="text-sm text-purple-600">User Rating</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Average user satisfaction score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}