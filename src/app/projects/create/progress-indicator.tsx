import { motion } from 'framer-motion'

export default function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              i < currentStep ? 'bg-purple-600' : 'bg-gray-300'
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: i === currentStep - 1 ? 1.2 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {i < currentStep ? (
              <svg  className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            ) : (
              <span className="text-gray-600">{i + 1}</span>
            )}
          </motion.div>
          {i < totalSteps - 1 && (
            <div className={`h-1 w-full ${i < currentStep - 1 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
          )}
        </div>
      ))}
    </div>
  )
}