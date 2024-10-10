import React from 'react'

interface LogoProps {
  size?: number
}

export default function Logo({ size = 35 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <circle cx="20" cy="20" r="18" fill="#8A2BE2" />
      <circle cx="35" cy="20" r="18" fill="#9370DB" opacity="0.7" />
      <circle cx="27.5" cy="32" r="18" fill="#BA55D3" opacity="0.7" />
    </svg>
  )
}