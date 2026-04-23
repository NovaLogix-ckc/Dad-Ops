import { Link } from '@tanstack/react-router'
import { Hammer, ClipboardList, PlusCircle, Info } from 'lucide-react'
import type { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <div className="brand-mark">
              <Hammer size={28} strokeWidth={2.5} />
            </div>
            <div className="brand-text">
              <span className="brand-title">DAD OPS</span>
              <span className="brand-tag">Jobs done. Jobs done right.</span>
            </div>
          </Link>

          <nav className="main-nav">
            <Link to="/" className="nav-link" activeProps={{ className: 'nav-link active' }} activeOptions={{ exact: true }}>
              <ClipboardList size={18} /> <span>Job Board</span>
            </Link>
            <Link to="/new" className="nav-link" activeProps={{ className: 'nav-link active' }}>
              <PlusCircle size={18} /> <span>Post a Job</span>
            </Link>
            <Link to="/about" className="nav-link" activeProps={{ className: 'nav-link active' }}>
              <Info size={18} /> <span>About</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <div className="footer-inner">
          <span>Dad Ops &mdash; a crew of the Parents & Teachers Community</span>
          <span className="footer-dot">&bull;</span>
          <span>Show up. Get it done. Have a cold one.</span>
        </div>
      </footer>
    </div>
  )
}
