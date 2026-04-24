import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { PlusCircle, Wrench, ClipboardList, CheckCircle2 } from 'lucide-react'
import { eventsQuery } from '../data/queries'
import { countFilled } from '../data/events'
import { EventCard } from '../components/EventCard'

export function EventsPage() {
  const { data: events = [], isLoading } = useQuery(eventsQuery())

  const open = events.filter((e) => e.status !== 'done')
  const done = events.filter((e) => e.status === 'done')

  const signedOn = open.reduce((n, e) => n + countFilled(e).filled, 0)

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Wrench size={14} /> MUCK-IN · EVENT BOARD</span>
          <h1 className="hero-title">Pick up a tool. Pick up a job.</h1>
          <p className="hero-sub">
            The Parents & Teachers Committee posts what needs doing — working bees,
            builds, event rosters. Put your name down, show up, knock it over.
          </p>
          <div className="hero-actions">
            <Link to="/new" className="btn btn-primary">
              <PlusCircle size={18} /> Post an event
            </Link>
            <a href="#open-events" className="btn btn-ghost">
              <ClipboardList size={18} /> See what's on
            </a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">{open.length}</span>
            <span className="stat-label">Events open</span>
          </div>
          <div className="stat">
            <span className="stat-num">{signedOn}</span>
            <span className="stat-label">Dads signed on</span>
          </div>
          <div className="stat">
            <span className="stat-num">{done.length}</span>
            <span className="stat-label">Jobs done</span>
          </div>
        </div>
      </section>

      <section id="open-events" className="section">
        <div className="section-head">
          <h2 className="section-title"><ClipboardList size={20} /> Upcoming</h2>
          <span className="section-count">{open.length}</span>
        </div>
        {isLoading ? (
          <p className="muted">Loading the roster…</p>
        ) : open.length === 0 ? (
          <div className="empty-card">
            <p>Nothing on the board. Toolbelt's hung up — for now.</p>
          </div>
        ) : (
          <div className="job-grid">
            {open.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {done.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="section-title"><CheckCircle2 size={20} /> Jobs done</h2>
            <span className="section-count">{done.length}</span>
          </div>
          <div className="job-grid">
            {done.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
