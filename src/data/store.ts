import {
  seedEvents,
  type EventJob,
  type OpsEvent,
  type SignupStyle,
  type Slot,
  type Volunteer,
} from './events'

let events: OpsEvent[] = structuredClone(seedEvents)

const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms))
const uid = () => Math.random().toString(36).slice(2, 10)

export async function listEvents(): Promise<OpsEvent[]> {
  await delay()
  return structuredClone(events).sort((a, b) => a.date.localeCompare(b.date))
}

export async function getEvent(id: string): Promise<OpsEvent | undefined> {
  await delay()
  const ev = events.find((e) => e.id === id)
  return ev ? structuredClone(ev) : undefined
}

// ---- creating events ---------------------------------------------------

export interface NewSlotInput {
  startTime?: string
  endTime?: string
  capacity: number
}

export interface NewJobInput {
  name: string
  description?: string
  slots: NewSlotInput[]
}

export interface NewEventInput {
  title: string
  details: string
  location: string
  date: string
  startTime?: string
  endTime?: string
  postedBy: string
  signupStyle: SignupStyle
  jobs: NewJobInput[]
}

export async function createEvent(input: NewEventInput): Promise<OpsEvent> {
  await delay()
  const ev: OpsEvent = {
    id: uid(),
    title: input.title,
    details: input.details,
    location: input.location,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    postedBy: input.postedBy,
    status: 'open',
    signupStyle: input.signupStyle,
    jobs: input.jobs.map<EventJob>((j) => ({
      id: uid(),
      name: j.name,
      description: j.description,
      slots: j.slots.map<Slot>((s) => ({
        id: uid(),
        startTime: s.startTime,
        endTime: s.endTime,
        capacity: s.capacity,
        volunteers: [],
      })),
    })),
  }
  events = [ev, ...events]
  return structuredClone(ev)
}

// ---- sign-up mutations -------------------------------------------------

function mutateSlot(
  eventId: string,
  jobId: string,
  slotId: string,
  fn: (slot: Slot) => Slot,
): OpsEvent {
  const eIdx = events.findIndex((e) => e.id === eventId)
  if (eIdx === -1) throw new Error('Event not found')
  const event = events[eIdx]
  const jIdx = event.jobs.findIndex((j) => j.id === jobId)
  if (jIdx === -1) throw new Error('Job not found')
  const job = event.jobs[jIdx]
  const sIdx = job.slots.findIndex((s) => s.id === slotId)
  if (sIdx === -1) throw new Error('Slot not found')

  const newSlot = fn(job.slots[sIdx])
  const newSlots = job.slots.slice()
  newSlots[sIdx] = newSlot
  const newJobs = event.jobs.slice()
  newJobs[jIdx] = { ...job, slots: newSlots }
  events[eIdx] = { ...event, jobs: newJobs }
  return events[eIdx]
}

export async function signUp(
  eventId: string,
  jobId: string,
  slotId: string,
  name: string,
): Promise<OpsEvent> {
  await delay()
  const event = mutateSlot(eventId, jobId, slotId, (slot) => {
    if (slot.volunteers.length >= slot.capacity) {
      throw new Error('Slot is full')
    }
    const volunteer: Volunteer = {
      id: uid(),
      name: name.trim(),
      signedUpAt: new Date().toISOString(),
    }
    return { ...slot, volunteers: [...slot.volunteers, volunteer] }
  })
  return structuredClone(event)
}

export async function removeVolunteer(
  eventId: string,
  jobId: string,
  slotId: string,
  volunteerId: string,
): Promise<OpsEvent> {
  await delay()
  const event = mutateSlot(eventId, jobId, slotId, (slot) => ({
    ...slot,
    volunteers: slot.volunteers.filter((v) => v.id !== volunteerId),
  }))
  return structuredClone(event)
}

export async function markDone(eventId: string): Promise<OpsEvent> {
  await delay()
  const idx = events.findIndex((e) => e.id === eventId)
  if (idx === -1) throw new Error('Event not found')
  events[idx] = { ...events[idx], status: 'done' }
  return structuredClone(events[idx])
}
