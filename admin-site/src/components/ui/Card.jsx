import React from 'react'

const Card = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
