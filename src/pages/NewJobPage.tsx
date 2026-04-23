import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CalendarDays, ClipboardList, Clock, Hammer, MapPin, Save, User, Users } from 'lucide-react'
import { useCreateJob } from '../data/queries'

interface FormState {
  title: string
  details: string
  location: string
  date: string
  startTime: string
  durationHours: string
  crewNeeded: string
  postedBy: string
}

const initial: FormState = {
  title: '',
  details: '',
  location: '',
  date: new Date().toISOString().slice(0, 10),
  startTime: '08:00',
  durationHours: '3',
  crewNeeded: '4',
  postedBy: '',
}

export function NewJobPage() {
  const navigate = useNavigate()
  const createJob = useCreateJob()
  const [form, setForm] = useState<FormState>(initial)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.details.trim() || !form.location.trim() || !form.postedBy.trim()) {
      setError('All fields are needed — give us the full brief.')
      return
    }
    const duration = Number(form.durationHours)
    const crew = Number(form.crewNeeded)
    if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(crew) || crew <= 0) {
      setError('Duration and crew size have to be numbers greater than zero.')
      return
    }
    setError(null)
    createJob.mutate(
      {
        title: form.title.trim(),
        details: form.details.trim(),
        location: form.location.trim(),
        date: form.date,
        startTime: form.startTime,
        durationHours: duration,
        crewNeeded: crew,
        postedBy: form.postedBy.trim(),
      },
      {
        onSuccess: (job) => {
          navigate({ to: '/jobs/$jobId', params: { jobId: job.id } })
        },
      },
    )
  }

  return (
    <div className="page">
      <div className="page-head">
        <span className="eyebrow"><Hammer size={14} /> NEW JOB</span>
        <h1 className="page-title">Post a job to the board</h1>
        <p className="muted">
          Write the brief like you're pinning it to the shed door. Keep it clear,
          keep it honest — the crew will do the rest.
        </p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title"><ClipboardList size={16} /> Job title</label>
          <input
            id="title"
            className="input"
            type="text"
            placeholder="Build the new BBQ shelter"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            maxLength={80}
          />
        </div>

        <div className="field">
          <label htmlFor="details">The brief</label>
          <textarea
            id="details"
            className="input textarea"
            rows={5}
            placeholder="Tools needed, what we're building, any heads-ups..."
            value={form.details}
            onChange={(e) => update('details', e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="location"><MapPin size={16} /> Location</label>
          <input
            id="location"
            className="input"
            type="text"
            placeholder="Senior playground — back fence"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="date"><CalendarDays size={16} /> Date</label>
            <input
              id="date"
              className="input"
              type="date"
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="start"><Clock size={16} /> Start time</label>
            <input
              id="start"
              className="input"
              type="time"
              value={form.startTime}
              onChange={(e) => update('startTime', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="duration"><Clock size={16} /> Hours</label>
            <input
              id="duration"
              className="input"
              type="number"
              min="1"
              max="24"
              value={form.durationHours}
              onChange={(e) => update('durationHours', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="crew"><Users size={16} /> Crew size</label>
            <input
              id="crew"
              className="input"
              type="number"
              min="1"
              max="50"
              value={form.crewNeeded}
              onChange={(e) => update('crewNeeded', e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="posted"><User size={16} /> Posted by</label>
          <input
            id="posted"
            className="input"
            type="text"
            placeholder="Parents Committee — your name"
            value={form.postedBy}
            onChange={(e) => update('postedBy', e.target.value)}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={createJob.isPending}>
            <Save size={18} /> {createJob.isPending ? 'Pinning it up…' : 'Post to the board'}
          </button>
        </div>
      </form>
    </div>
  )
}
