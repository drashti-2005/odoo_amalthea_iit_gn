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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Expense Management
                <span className="text-gradient block">Made Simple</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your expense reporting process with intelligent automation, 
                role-based approvals, and real-time insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Watch Demo
                </Button>
              </div>
              
              <div className="mt-8 flex items-center gap-8 text-sm text-gray-600">
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
              className="relative"
            >
              <Hero3DAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage expenses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make expense management effortless for teams of any size
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
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
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to streamline your expenses?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
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
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold text-gradient mb-4">ExpenseFlow</div>
          <p className="text-gray-400">© 2024 ExpenseFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
