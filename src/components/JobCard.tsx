import { Link } from '@tanstack/react-router'
import { CalendarDays, Clock, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react'
import type { Job } from '../data/jobs'
import { formatDate, formatTime } from '../lib/format'

export function JobCard({ job }: { job: Job }) {
  const filled = job.volunteers.length
  const spots = Math.max(job.crewNeeded - filled, 0)
  const done = job.status === 'done'

  return (
    <article className={`job-card ${done ? 'is-done' : ''}`}>
      <div className="job-card-stripe" />
      <div className="job-card-body">
        <header className="job-card-head">
          <h3 className="job-card-title">{job.title}</h3>
          {done ? (
            <span className="tag tag-done">
              <CheckCircle2 size={14} /> Job done
            </span>
          ) : spots === 0 ? (
            <span className="tag tag-full">Crew full</span>
          ) : (
            <span className="tag tag-open">{spots} spot{spots === 1 ? '' : 's'} left</span>
          )}
        </header>

        <p className="job-card-details">{job.details}</p>

        <ul className="job-meta">
          <li><CalendarDays size={16} /> {formatDate(job.date)}</li>
          <li><Clock size={16} /> {formatTime(job.startTime)} · {job.durationHours}h</li>
          <li><MapPin size={16} /> {job.location}</li>
          <li><Users size={16} /> {filled}/{job.crewNeeded} crew</li>
        </ul>

        <footer className="job-card-foot">
          <span className="posted-by">Posted by {job.postedBy}</span>
          <Link to="/jobs/$jobId" params={{ jobId: job.id }} className="btn btn-ghost">
            Details <ArrowRight size={16} />
          </Link>
        </footer>
      </div>
    </article>
  )
}
