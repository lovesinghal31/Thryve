import React from 'react'
import Card from './Card'

const StatCard = ({ title, value, hint }) => (
  <Card className="p-4">
    <div className="text-sm text-gray-400">{title}</div>
    <div className="mt-1 text-2xl font-bold text-white">{value}</div>
    {hint && <div className="mt-2 text-xs text-gray-500">{hint}</div>}
  </Card>
)

export default StatCard
