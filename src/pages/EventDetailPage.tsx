import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Hammer,
  MapPin,
  ShieldCheck,
  Users,
  UserPlus,
  UserMinus,
} from 'lucide-react'
import {
  countFilled,
  slotIsFull,
  type EventJob,
  type OpsEvent,
  type Slot,
} from '../data/events'
import { eventQuery, useMarkDone, useRemoveVolunteer, useSignUp } from '../data/queries'
import { formatDate, formatTime } from '../lib/format'

export function EventDetailPage() {
  const { eventId } = useParams({ from: '/events/$eventId' })
  const { data: event, isLoading } = useQuery(eventQuery(eventId))
  const markDone = useMarkDone(eventId)

  if (isLoading) {
    return <div className="page"><p className="muted">Loading…</p></div>
  }

  if (!event) {
    return (
      <div className="page">
        <p className="muted">That event has vanished from the board.</p>
        <Link to="/" className="btn btn-ghost"><ArrowLeft size={16} /> Back to the board</Link>
      </div>
    )
  }

  const { filled, capacity } = countFilled(event)
  const spots = Math.max(capacity - filled, 0)
  const done = event.status === 'done'

  const timeLabel =
    event.startTime && event.endTime
      ? `${formatTime(event.startTime)}–${formatTime(event.endTime)}`
      : event.startTime
      ? formatTime(event.startTime)
      : 'Time TBC'

  return (
    <div className="page">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to the board</Link>

      <article className={`job-detail ${done ? 'is-done' : ''}`}>
        <header className="job-detail-head">
          <div>
            <span className="eyebrow"><Hammer size={14} /> EVENT #{event.id.slice(0, 6).toUpperCase()}</span>
            <h1 className="job-detail-title">{event.title}</h1>
            <p className="posted-by">Posted by {event.postedBy}</p>
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
          <li><CalendarDays size={18} /> {formatDate(event.date)}</li>
          <li><Clock size={18} /> {timeLabel}</li>
          <li><MapPin size={18} /> {event.location}</li>
          <li><Users size={18} /> {filled}/{capacity} signed on</li>
        </ul>

        <section className="job-detail-section">
          <h2>The brief</h2>
          <p className="details-body">{event.details}</p>
        </section>

        {event.signupStyle === 'open' ? (
          <OpenSignupSection event={event} done={done} />
        ) : event.signupStyle === 'jobs' ? (
          <JobsSection event={event} done={done} />
        ) : (
          <ScheduledSection event={event} done={done} />
        )}

        {!done && (
          <section className="job-detail-section">
            <button
              className="btn btn-mark-done"
              onClick={() => markDone.mutate()}
              disabled={markDone.isPending}
            >
              <ShieldCheck size={18} /> Mark event as done
            </button>
          </section>
        )}
      </article>
    </div>
  )
}

// ---- layouts for each signup style ------------------------------------

function OpenSignupSection({ event, done }: { event: OpsEvent; done: boolean }) {
  const job = event.jobs[0]
  const slot = job.slots[0]
  return (
    <section className="job-detail-section">
      <div className="section-head">
        <h2><Users size={18} /> Crew on the job</h2>
        <span className="section-count">{slot.volunteers.length}/{slot.capacity}</span>
      </div>
      <SlotPanel event={event} job={job} slot={slot} done={done} hideWindow />
    </section>
  )
}

function JobsSection({ event, done }: { event: OpsEvent; done: boolean }) {
  return (
    <section className="job-detail-section">
      <div className="section-head">
        <h2><Users size={18} /> Jobs & crew</h2>
      </div>
      <div className="jobs-grid">
        {event.jobs.map((job) => {
          const slot = job.slots[0]
          return (
            <div key={job.id} className="job-panel">
              <header className="job-panel-head">
                <div>
                  <h3 className="job-panel-title">{job.name}</h3>
                  {job.description && <p className="job-panel-desc">{job.description}</p>}
                </div>
                <span className="crew-count">
                  {slot.volunteers.length}/{slot.capacity}
                </span>
              </header>
              <SlotPanel event={event} job={job} slot={slot} done={done} hideWindow />
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ScheduledSection({ event, done }: { event: OpsEvent; done: boolean }) {
  return (
    <section className="job-detail-section">
      <div className="section-head">
        <h2><Clock size={18} /> Roster by session</h2>
      </div>
      <div className="jobs-stack">
        {event.jobs.map((job) => (
          <div key={job.id} className="job-panel">
            <header className="job-panel-head">
              <div>
                <h3 className="job-panel-title">{job.name}</h3>
                {job.description && <p className="job-panel-desc">{job.description}</p>}
              </div>
            </header>
            <div className="slot-list">
              {job.slots.map((slot) => (
                <SlotPanel key={slot.id} event={event} job={job} slot={slot} done={done} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ---- shared slot panel -------------------------------------------------

function SlotPanel({
  event,
  job,
  slot,
  done,
  hideWindow,
}: {
  event: OpsEvent
  job: EventJob
  slot: Slot
  done: boolean
  hideWindow?: boolean
}) {
  const signUp = useSignUp(event.id)
  const removeVolunteer = useRemoveVolunteer(event.id)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const full = slotIsFull(slot)
  const remaining = Math.max(slot.capacity - slot.volunteers.length, 0)
  const showWindow = !hideWindow && !!slot.startTime

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setError('Put a name down, mate.')
    if (trimmed.length > 40) return setError('Keep it under 40 characters.')
    setError(null)
    signUp.mutate(
      { jobId: job.id, slotId: slot.id, name: trimmed },
      { onSuccess: () => setName('') },
    )
  }

  return (
    <div className={`slot-panel ${full ? 'is-full' : ''}`}>
      {showWindow && (
        <div className="slot-window">
          <Clock size={14} /> {formatTime(slot.startTime!)}
          {slot.endTime && <> – {formatTime(slot.endTime)}</>}
          <span className="slot-remaining">
            {full ? 'Full' : `${remaining} spot${remaining === 1 ? '' : 's'} left`}
          </span>
        </div>
      )}

      {slot.volunteers.length === 0 ? (
        <p className="muted slot-empty">No one on the crew yet.</p>
      ) : (
        <ul className="volunteer-list tight">
          {slot.volunteers.map((v) => (
            <li key={v.id} className="volunteer-row">
              <span className="volunteer-avatar">{v.name.charAt(0).toUpperCase()}</span>
              <span className="volunteer-name">{v.name}</span>
              {!done && (
                <button
                  className="btn-icon"
                  title="Pull out"
                  onClick={() =>
                    removeVolunteer.mutate({ jobId: job.id, slotId: slot.id, volunteerId: v.id })
                  }
                  disabled={removeVolunteer.isPending}
                >
                  <UserMinus size={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {!done && !full && (
        <form className="slot-signup" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary" disabled={signUp.isPending}>
            <UserPlus size={14} /> I'm in
          </button>
        </form>
      )}
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}
