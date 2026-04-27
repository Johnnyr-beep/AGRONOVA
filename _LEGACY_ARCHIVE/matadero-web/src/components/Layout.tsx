import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { OfflineBanner } from './OfflineBanner'

function Layout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--surface-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
      {/* Banner flotante de estado offline */}
      <OfflineBanner />
    </div>
  )
}

export default Layout
