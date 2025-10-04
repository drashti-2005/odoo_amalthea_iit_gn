import { motion } from 'framer-motion';

export function Hero3DAnimation() {
  return (
    <div className="relative w-full h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotateY: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative bg-white rounded-xl shadow-xl p-6 w-80 transform -rotate-3"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Expenses</h3>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Travel</span>
              <span className="text-sm font-medium text-gray-800">$1,250</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 2, delay: 1 }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute top-12 left-1/4 text-3xl"
        >
          💰
        </motion.div>

        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-12 right-1/4 text-3xl"
        >
          📊
        </motion.div>
      </motion.div>
    </div>
  );
}
