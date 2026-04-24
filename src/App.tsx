import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TabNav from './components/TabNav'
import Lessons from './pages/Lessons'
import Walkthroughs from './pages/Walkthroughs'
import Equations from './pages/Equations'
import Practice from './pages/Practice'
import Playground from './pages/Playground'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">
            EGR Econ Helper
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Engineering Economic Analysis — Interactive Tutor
          </p>
        </header>

        <TabNav />

        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/lessons" replace />} />
            <Route path="/lessons/*" element={<Lessons />} />
            <Route path="/walkthroughs/*" element={<Walkthroughs />} />
            <Route path="/equations" element={<Equations />} />
            <Route path="/practice/*" element={<Practice />} />
            <Route path="/playground" element={<Playground />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
