import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Hammer,
  MapPin,
  Users,
  UserPlus,
  UserMinus,
  ShieldCheck,
} from 'lucide-react'
import { jobQuery, useAddVolunteer, useMarkDone, useRemoveVolunteer } from '../data/queries'
import { formatDate, formatTime } from '../lib/format'

export function JobDetailPage() {
  const { jobId } = useParams({ from: '/jobs/$jobId' })
  const { data: job, isLoading } = useQuery(jobQuery(jobId))

  const addVolunteer = useAddVolunteer(jobId)
  const removeVolunteer = useRemoveVolunteer(jobId)
  const markDone = useMarkDone(jobId)

  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const filled = job?.volunteers.length ?? 0
  const spots = useMemo(() => (job ? Math.max(job.crewNeeded - filled, 0) : 0), [job, filled])

  if (isLoading) {
    return <div className="page"><p className="muted">Loading…</p></div>
  }

  if (!job) {
    return (
      <div className="page">
        <p className="muted">That job has vanished from the board.</p>
        <Link to="/" className="btn btn-ghost"><ArrowLeft size={16} /> Back to the board</Link>
      </div>
    )
  }

  const done = job.status === 'done'

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Put a name down, mate.')
      return
    }
    if (trimmed.length > 40) {
      setError("That's a long name — keep it under 40 characters.")
      return
    }
    setError(null)
    addVolunteer.mutate(trimmed, {
      onSuccess: () => setName(''),
    })
  }

  return (
    <div className="page">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to the board</Link>

      <article className={`job-detail ${done ? 'is-done' : ''}`}>
        <header className="job-detail-head">
          <div>
            <span className="eyebrow"><Hammer size={14} /> JOB #{job.id.slice(0, 6).toUpperCase()}</span>
            <h1 className="job-detail-title">{job.title}</h1>
            <p className="posted-by">Posted by {job.postedBy}</p>
          </div>
          {done ? (
            <span className="tag tag-done big"><CheckCircle2 size={16} /> Job done</span>
          ) : spots === 0 ? (
            <span className="tag tag-full big">Crew full</span>
          ) : (
            <span className="tag tag-open big">{spots} spot{spots === 1 ? '' : 's'} left</span>
          )}
        </header>

        <ul className="job-meta big">
          <li><CalendarDays size={18} /> {formatDate(job.date)}</li>
          <li><Clock size={18} /> {formatTime(job.startTime)} · {job.durationHours}h on the tools</li>
          <li><MapPin size={18} /> {job.location}</li>
          <li><Users size={18} /> {filled}/{job.crewNeeded} crew</li>
        </ul>

        <section className="job-detail-section">
          <h2>The brief</h2>
          <p className="details-body">{job.details}</p>
        </section>

        <section className="job-detail-section">
          <div className="section-head">
            <h2><Users size={18} /> Crew on the job</h2>
            <span className="section-count">{filled}</span>
          </div>
          {job.volunteers.length === 0 ? (
            <p className="muted">No one on the crew yet. Be the first to pick up a tool.</p>
          ) : (
            <ul className="volunteer-list">
              {job.volunteers.map((v) => (
                <li key={v.id} className="volunteer-row">
                  <span className="volunteer-avatar">{v.name.charAt(0).toUpperCase()}</span>
                  <span className="volunteer-name">{v.name}</span>
                  <button
                    className="btn-icon"
                    title="Pull out"
                    onClick={() => removeVolunteer.mutate(v.id)}
                    disabled={removeVolunteer.isPending || done}
                  >
                    <UserMinus size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!done && (
            <form className="signup-form" onSubmit={handleSignUp}>
              <label className="signup-label" htmlFor="volunteer-name">
                Put your name down
              </label>
              <div className="signup-row">
                <input
                  id="volunteer-name"
                  className="input"
                  type="text"
                  placeholder="e.g. Dave M."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={addVolunteer.isPending}
                >
                  <UserPlus size={16} /> I'm in
                </button>
              </div>
              {error && <p className="form-error">{error}</p>}
              <p className="form-hint">
                More than one bloke can sign up. No email, no fuss — just a name.
              </p>
            </form>
          )}
        </section>

        {!done && (
          <section className="job-detail-section">
            <button
              className="btn btn-mark-done"
              onClick={() => markDone.mutate()}
              disabled={markDone.isPending}
              title="Mark this job as done"
            >
              <ShieldCheck size={18} /> Mark job as done
            </button>
          </section>
        )}
      </article>
    </div>
  )
}
