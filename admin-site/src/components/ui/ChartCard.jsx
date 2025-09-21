import React from 'react'
import Card from './Card'

const ChartCard = ({ title, children }) => (
  <Card className="p-4">
    <div className="mb-2 text-sm font-medium text-gray-300">{title}</div>
    <div className="h-64">{children}</div>
  </Card>
)

export default ChartCard
