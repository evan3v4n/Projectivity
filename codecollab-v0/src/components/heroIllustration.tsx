import React from 'react'
import { motion } from 'framer-motion'

export default function HeroIllustration() {
  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  }

  const circles = [
    { cx: 200, cy: 200, r: 70, fill: "#FFFFFF", opacity: 0.9 },
    { cx: 260, cy: 200, r: 70, fill: "#F0E6FF", opacity: 0.8 },
    { cx: 230, cy: 260, r: 70, fill: "#D8BFFF", opacity: 0.8 },
    { cx: 100, cy: 100, r: 40, fill: "#FFFFFF", opacity: 0.7 },
    { cx: 300, cy: 100, r: 30, fill: "#F0E6FF", opacity: 0.7 },
    { cx: 100, cy: 300, r: 35, fill: "#D8BFFF", opacity: 0.7 },
    { cx: 300, cy: 300, r: 25, fill: "#FFFFFF", opacity: 0.7 },
    { cx: 150, cy: 150, r: 20, fill: "#F0E6FF", opacity: 0.6 },
    { cx: 350, cy: 200, r: 15, fill: "#D8BFFF", opacity: 0.6 },
    { cx: 200, cy: 350, r: 25, fill: "#FFFFFF", opacity: 0.6 },
    { cx: 50, cy: 200, r: 20, fill: "#F0E6FF", opacity: 0.6 },
    { cx: 150, cy: 350, r: 15, fill: "#D8BFFF", opacity: 0.6 },
    { cx: 350, cy: 350, r: 20, fill: "#FFFFFF", opacity: 0.6 },
  ]

  return (
    <div className="relative w-full h-80 md:h-96 lg:h-[30rem]">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.g
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          {circles.map((circle, index) => (
            <motion.circle
              key={index}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill={circle.fill}
              fillOpacity={circle.opacity}
              variants={circleVariants}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          ))}
        </motion.g>
      </svg>
    </div>
  )
}