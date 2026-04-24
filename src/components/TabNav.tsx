import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/lessons', label: 'Lessons', icon: '1' },
  { to: '/walkthroughs', label: 'Walkthroughs', icon: '2' },
  { to: '/equations', label: 'Equations', icon: '3' },
  { to: '/practice', label: 'Practice', icon: '4' },
  { to: '/playground', label: 'Playground', icon: '5' },
]

export default function TabNav() {
  return (
    <nav className="bg-slate-800/50 border-b border-slate-700">
      <div className="flex gap-1 px-4 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-5 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
