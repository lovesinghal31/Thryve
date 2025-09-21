import React from 'react'

const Tasks = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-white">Tasks</h1>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <p className="text-sm text-gray-300">TODO: Admin task assignment and tracking features.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="text-sm font-medium text-white">Upcoming</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-300">
            <li>Assign tasks to counselors</li>
            <li>Track completion status</li>
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="text-sm font-medium text-white">Completed</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-300">
            <li>Design tasks schema</li>
            <li>Define permissions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Tasks
