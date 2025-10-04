import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Hero3DAnimation } from '../components/animations/Hero3DAnimation';

const features = [
  {
    title: 'Smart Expense Tracking',
    description: 'Track expenses with intelligent categorization and receipt scanning',
    icon: '📊',
  },
  {
    title: 'Automated Approvals',
    description: 'Configure approval workflows based on roles and expense amounts',
    icon: '✅',
  },
  {
    title: 'Real-time Reports',
    description: 'Get insights with comprehensive expense reports and analytics',
    icon: '📈',
  },
  {
    title: 'Multi-currency Support',
    description: 'Handle expenses in multiple currencies with automatic conversion',
    icon: '💱',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="container-max flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-gradient"
          >
            ExpenseFlow
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Expense Management
                <span className="text-gradient block">Made Simple</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your expense reporting process with intelligent automation, 
                role-based approvals, and real-time insights.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Link to="/signup" className="w-full">
                  <Button size="lg" className="w-full">
                    Start Free Trial
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full">
                  Watch Demo
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  14-day free trial
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative order-1 lg:order-2"
            >
              <Hero3DAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-20 bg-white/50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage expenses
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make expense management effortless for teams of any size
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid-expense-cards"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card hover className="h-full text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ready to streamline your expenses?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Join thousands of companies already using ExpenseFlow
            </p>
            <Link to="/signup">
              <Button size="lg">
                Get Started Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="container-max text-center">
          <div className="text-2xl font-bold text-gradient mb-4">ExpenseFlow</div>
          <p className="text-gray-400">© 2024 ExpenseFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
