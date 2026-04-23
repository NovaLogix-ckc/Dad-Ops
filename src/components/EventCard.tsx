import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  ClipboardList,
  Layers,
  MapPin,
  Users,
} from 'lucide-react'
import { countFilled, type OpsEvent } from '../data/events'
import { formatDate, formatTime } from '../lib/format'

function styleBadge(event: OpsEvent) {
  const jobCount = event.jobs.length
  const slotCount = event.jobs.reduce((n, j) => n + j.slots.length, 0)
  switch (event.signupStyle) {
    case 'open':
      return { icon: Users, label: 'Open signup' }
    case 'jobs':
      return { icon: ClipboardList, label: `${jobCount} jobs` }
    case 'scheduled':
      return { icon: Layers, label: `${jobCount} jobs · ${slotCount} sessions` }
  }
}

export function EventCard({ event }: { event: OpsEvent }) {
  const { filled, capacity } = countFilled(event)
  const spots = Math.max(capacity - filled, 0)
  const done = event.status === 'done'
  const badge = styleBadge(event)
  const BadgeIcon = badge.icon

  const timeLabel =
    event.startTime && event.endTime
      ? `${formatTime(event.startTime)}–${formatTime(event.endTime)}`
      : event.startTime
      ? formatTime(event.startTime)
      : 'Time TBC'

  return (
    <article className={`job-card ${done ? 'is-done' : ''}`}>
      <div className="job-card-stripe" />
      <div className="job-card-body">
        <header className="job-card-head">
          <div>
            <span className="card-style-badge">
              <BadgeIcon size={12} /> {badge.label}
            </span>
            <h3 className="job-card-title">{event.title}</h3>
          </div>
          {done ? (
            <span className="tag tag-done">
              <CheckCircle2 size={14} /> Done
            </span>
          ) : spots === 0 ? (
            <span className="tag tag-full">Full</span>
          ) : (
            <span className="tag tag-open">{spots} spot{spots === 1 ? '' : 's'} left</span>
          )}
        </header>

        <p className="job-card-details">{event.details}</p>

        <ul className="job-meta">
          <li><CalendarDays size={16} /> {formatDate(event.date)}</li>
          <li><Clock size={16} /> {timeLabel}</li>
          <li><MapPin size={16} /> {event.location}</li>
          <li><Users size={16} /> {filled}/{capacity} signed on</li>
        </ul>

        <div className="fill-bar" aria-hidden>
          <div
            className="fill-bar-inner"
            style={{ width: `${capacity === 0 ? 0 : (filled / capacity) * 100}%` }}
          />
        </div>

        <footer className="job-card-foot">
          <span className="posted-by">Posted by {event.postedBy}</span>
          <Link to="/events/$eventId" params={{ eventId: event.id }} className="btn btn-ghost">
            Details <ArrowRight size={16} />
          </Link>
        </footer>
      </div>
    </article>
  )
}
