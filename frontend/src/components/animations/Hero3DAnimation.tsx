import { useRef } from 'react';
import { motion } from 'framer-motion';

export function Hero3DAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-96 flex items-center justify-center"
    >
      {/* Floating Cards Animation */}
      <div className="relative w-full h-full">
        {/* Main Dashboard Card */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-40 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            y: [0, -10, 0],
            rotateY: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Total Expenses</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">$24,580</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 2, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Expense Item Cards */}
        <motion.div
          className="absolute top-16 right-8 w-48 h-24 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-lg border border-green-200 p-4"
          animate={{
            x: [0, 15, 0],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-green-700 font-medium">Approved</div>
              <div className="text-lg font-bold text-green-800">$2,450</div>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-16 left-8 w-48 h-24 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg shadow-lg border border-orange-200 p-4"
          animate={{
            x: [0, -12, 0],
            y: [0, 8, 0],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-orange-700 font-medium">Pending</div>
              <div className="text-lg font-bold text-orange-800">$1,250</div>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </motion.div>

        {/* Receipt Card */}
        <motion.div
          className="absolute top-1/4 left-4 w-32 h-40 bg-white rounded-lg shadow-xl border border-gray-200 p-3"
          animate={{
            rotateZ: [-2, 2, -2],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        >
          <div className="h-full flex flex-col">
            <div className="text-xs font-medium text-gray-600 mb-2">Receipt</div>
            <div className="flex-1 bg-gray-100 rounded p-2">
              <div className="space-y-1">
                <div className="w-full h-1 bg-gray-300 rounded"></div>
                <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
                <div className="w-1/2 h-1 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">$89.50</div>
          </div>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i * 8)}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + (i * 0.5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
