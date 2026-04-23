import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  CalendarDays,
  ClipboardList,
  Clock,
  Hammer,
  Layers,
  MapPin,
  Plus,
  Save,
  Trash2,
  User,
  Users,
} from 'lucide-react'
import { useCreateEvent } from '../data/queries'
import type { SignupStyle } from '../data/events'

interface SlotDraft {
  id: string
  startTime: string
  endTime: string
  capacity: string
}

interface JobDraft {
  id: string
  name: string
  description: string
  slots: SlotDraft[]
}

const draftId = () => Math.random().toString(36).slice(2, 8)

const newSlot = (startTime = '', endTime = '', capacity = '2'): SlotDraft => ({
  id: draftId(),
  startTime,
  endTime,
  capacity,
})

const newJob = (name = '', slots: SlotDraft[] = [newSlot()]): JobDraft => ({
  id: draftId(),
  name,
  description: '',
  slots,
})

export function NewEventPage() {
  const navigate = useNavigate()
  const createEvent = useCreateEvent()

  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('12:00')
  const [postedBy, setPostedBy] = useState('')
  const [signupStyle, setSignupStyle] = useState<SignupStyle>('open')

  const [openCapacity, setOpenCapacity] = useState('10')
  const [jobs, setJobs] = useState<JobDraft[]>([
    newJob('BBQ', [newSlot('', '', '3')]),
    newJob('Setup', [newSlot('', '', '4')]),
  ])
  const [scheduled, setScheduled] = useState<JobDraft[]>([
    newJob('BBQ', [
      newSlot('18:00', '19:00', '3'),
      newSlot('19:00', '20:00', '3'),
      newSlot('20:00', '21:00', '3'),
    ]),
  ])

  const [error, setError] = useState<string | null>(null)

  const updateJob = (
    list: JobDraft[],
    setList: (j: JobDraft[]) => void,
    id: string,
    patch: Partial<JobDraft>,
  ) => {
    setList(list.map((j) => (j.id === id ? { ...j, ...patch } : j)))
  }

  const updateSlot = (
    list: JobDraft[],
    setList: (j: JobDraft[]) => void,
    jobId: string,
    slotId: string,
    patch: Partial<SlotDraft>,
  ) => {
    setList(
      list.map((j) =>
        j.id === jobId
          ? { ...j, slots: j.slots.map((s) => (s.id === slotId ? { ...s, ...patch } : s)) }
          : j,
      ),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !details.trim() || !location.trim() || !postedBy.trim()) {
      return setError('Fill in the event basics — title, brief, location, and who posted it.')
    }

    let jobsInput
    if (signupStyle === 'open') {
      const cap = Number(openCapacity)
      if (!Number.isFinite(cap) || cap <= 0) return setError('Crew size has to be a positive number.')
      jobsInput = [{ name: 'Crew', slots: [{ capacity: cap }] }]
    } else if (signupStyle === 'jobs') {
      if (jobs.length === 0) return setError('Add at least one job.')
      const invalid = jobs.find((j) => !j.name.trim() || !j.slots[0] || Number(j.slots[0].capacity) <= 0)
      if (invalid) return setError('Every job needs a name and a crew size above zero.')
      jobsInput = jobs.map((j) => ({
        name: j.name.trim(),
        description: j.description.trim() || undefined,
        slots: [{ capacity: Number(j.slots[0].capacity) }],
      }))
    } else {
      if (scheduled.length === 0) return setError('Add at least one job.')
      for (const j of scheduled) {
        if (!j.name.trim()) return setError('Every job needs a name.')
        if (j.slots.length === 0) return setError(`Job "${j.name}" needs at least one session.`)
        for (const s of j.slots) {
          if (!s.startTime || !s.endTime) return setError(`Every session on "${j.name}" needs a start and end time.`)
          if (!(Number(s.capacity) > 0)) return setError(`Every session on "${j.name}" needs a crew size above zero.`)
        }
      }
      jobsInput = scheduled.map((j) => ({
        name: j.name.trim(),
        description: j.description.trim() || undefined,
        slots: j.slots.map((s) => ({
          startTime: s.startTime,
          endTime: s.endTime,
          capacity: Number(s.capacity),
        })),
      }))
    }

    setError(null)
    createEvent.mutate(
      {
        title: title.trim(),
        details: details.trim(),
        location: location.trim(),
        date,
        startTime,
        endTime,
        postedBy: postedBy.trim(),
        signupStyle,
        jobs: jobsInput,
      },
      {
        onSuccess: (event) => navigate({ to: '/events/$eventId', params: { eventId: event.id } }),
      },
    )
  }

  return (
    <div className="page">
      <div className="page-head">
        <span className="eyebrow"><Hammer size={14} /> NEW EVENT</span>
        <h1 className="page-title">Post an event to the board</h1>
        <p className="muted">
          Pin it up like it's going on the shed door — clear brief, clear times,
          clear spots. Dads will fill them in.
        </p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title"><ClipboardList size={16} /> Event title</label>
          <input id="title" className="input" type="text" placeholder="School disco — crew roster"
            value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
        </div>

        <div className="field">
          <label htmlFor="details">The brief</label>
          <textarea id="details" className="input textarea" rows={5}
            placeholder="What we're doing, what to bring, any heads-ups..."
            value={details} onChange={(e) => setDetails(e.target.value)} />
        </div>

        <div className="field">
          <label htmlFor="location"><MapPin size={16} /> Location</label>
          <input id="location" className="input" type="text"
            placeholder="School hall & quadrangle"
            value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="date"><CalendarDays size={16} /> Date</label>
            <input id="date" className="input" type="date"
              value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="start"><Clock size={16} /> Start</label>
            <input id="start" className="input" type="time"
              value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="end"><Clock size={16} /> Finish</label>
            <input id="end" className="input" type="time"
              value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="posted"><User size={16} /> Posted by</label>
          <input id="posted" className="input" type="text"
            placeholder="Parents Committee — your name"
            value={postedBy} onChange={(e) => setPostedBy(e.target.value)} />
        </div>

        <div className="field">
          <label>Signup style</label>
          <div className="style-picker">
            <StyleOption active={signupStyle === 'open'} onClick={() => setSignupStyle('open')}
              icon={<Users size={18} />} title="Open signup"
              blurb="One list, one crew size. Dads put their name down." />
            <StyleOption active={signupStyle === 'jobs'} onClick={() => setSignupStyle('jobs')}
              icon={<ClipboardList size={18} />} title="Specific jobs"
              blurb="Named jobs (BBQ, Setup, Pack-down) each with a crew size." />
            <StyleOption active={signupStyle === 'scheduled'} onClick={() => setSignupStyle('scheduled')}
              icon={<Layers size={18} />} title="Jobs with sessions"
              blurb="Jobs split into timed sessions — e.g. BBQ 6pm / 7pm / 8pm." />
          </div>
        </div>

        {signupStyle === 'open' && (
          <div className="field">
            <label htmlFor="cap"><Users size={16} /> Crew size</label>
            <input id="cap" className="input narrow" type="number" min="1" max="200"
              value={openCapacity} onChange={(e) => setOpenCapacity(e.target.value)} />
          </div>
        )}

        {signupStyle === 'jobs' && (
          <JobsBuilder
            jobs={jobs}
            setJobs={setJobs}
            withTimes={false}
            onAdd={() => setJobs([...jobs, newJob('', [newSlot('', '', '2')])])}
            updateJob={(id, patch) => updateJob(jobs, setJobs, id, patch)}
            updateSlot={(jobId, slotId, patch) => updateSlot(jobs, setJobs, jobId, slotId, patch)}
          />
        )}

        {signupStyle === 'scheduled' && (
          <JobsBuilder
            jobs={scheduled}
            setJobs={setScheduled}
            withTimes
            onAdd={() => setScheduled([...scheduled, newJob('', [newSlot('', '', '2')])])}
            updateJob={(id, patch) => updateJob(scheduled, setScheduled, id, patch)}
            updateSlot={(jobId, slotId, patch) =>
              updateSlot(scheduled, setScheduled, jobId, slotId, patch)
            }
          />
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={createEvent.isPending}>
            <Save size={18} /> {createEvent.isPending ? 'Pinning it up…' : 'Post to the board'}
          </button>
        </div>
      </form>
    </div>
  )
}

function StyleOption({
  active, onClick, icon, title, blurb,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  blurb: string
}) {
  return (
    <button type="button" className={`style-option ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="style-icon">{icon}</span>
      <span className="style-title">{title}</span>
      <span className="style-blurb">{blurb}</span>
    </button>
  )
}

interface BuilderProps {
  jobs: JobDraft[]
  setJobs: (j: JobDraft[]) => void
  withTimes: boolean
  onAdd: () => void
  updateJob: (id: string, patch: Partial<JobDraft>) => void
  updateSlot: (jobId: string, slotId: string, patch: Partial<SlotDraft>) => void
}

function JobsBuilder({ jobs, setJobs, withTimes, onAdd, updateJob, updateSlot }: BuilderProps) {
  const removeJob = (id: string) => setJobs(jobs.filter((j) => j.id !== id))

  const addSlot = (jobId: string) =>
    setJobs(
      jobs.map((j) =>
        j.id === jobId ? { ...j, slots: [...j.slots, newSlot('', '', '2')] } : j,
      ),
    )

  const removeSlot = (jobId: string, slotId: string) =>
    setJobs(
      jobs.map((j) =>
        j.id === jobId ? { ...j, slots: j.slots.filter((s) => s.id !== slotId) } : j,
      ),
    )

  return (
    <div className="builder">
      {jobs.map((job, i) => (
        <div key={job.id} className="builder-job">
          <header className="builder-job-head">
            <span className="builder-job-num">Job {i + 1}</span>
            {jobs.length > 1 && (
              <button type="button" className="btn-icon" onClick={() => removeJob(job.id)} title="Remove job">
                <Trash2 size={14} />
              </button>
            )}
          </header>

          <div className="field">
            <label>Job name</label>
            <input className="input" type="text" placeholder="e.g. BBQ"
              value={job.name}
              onChange={(e) => updateJob(job.id, { name: e.target.value })} />
          </div>

          <div className="field">
            <label>What's involved (optional)</label>
            <input className="input" type="text" placeholder="Two on the grill, one on buns..."
              value={job.description}
              onChange={(e) => updateJob(job.id, { description: e.target.value })} />
          </div>

          {!withTimes ? (
            <div className="field">
              <label>Crew size</label>
              <input className="input narrow" type="number" min="1" max="100"
                value={job.slots[0]?.capacity ?? '1'}
                onChange={(e) => updateSlot(job.id, job.slots[0].id, { capacity: e.target.value })} />
            </div>
          ) : (
            <div className="builder-slots">
              <div className="builder-slots-head">
                <span>Sessions</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => addSlot(job.id)}>
                  <Plus size={14} /> Add session
                </button>
              </div>
              {job.slots.map((slot) => (
                <div key={slot.id} className="builder-slot-row">
                  <input className="input" type="time"
                    value={slot.startTime}
                    onChange={(e) => updateSlot(job.id, slot.id, { startTime: e.target.value })} />
                  <span className="builder-slot-dash">–</span>
                  <input className="input" type="time"
                    value={slot.endTime}
                    onChange={(e) => updateSlot(job.id, slot.id, { endTime: e.target.value })} />
                  <input className="input narrow" type="number" min="1" max="100" placeholder="Crew"
                    value={slot.capacity}
                    onChange={(e) => updateSlot(job.id, slot.id, { capacity: e.target.value })} />
                  {job.slots.length > 1 && (
                    <button type="button" className="btn-icon" onClick={() => removeSlot(job.id, slot.id)} title="Remove session">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button type="button" className="btn btn-ghost" onClick={onAdd}>
        <Plus size={16} /> Add another job
      </button>
    </div>
  )
}
