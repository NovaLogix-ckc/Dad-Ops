import { seedJobs, type Job, type Volunteer } from './jobs'

// In-memory mock store. All mutations resolve async to simulate a real API.
let jobs: Job[] = structuredClone(seedJobs)

const delay = (ms = 180) => new Promise((r) => setTimeout(r, ms))

const uid = () => Math.random().toString(36).slice(2, 10)

export async function listJobs(): Promise<Job[]> {
  await delay()
  return structuredClone(jobs).sort((a, b) => a.date.localeCompare(b.date))
}

export async function getJob(id: string): Promise<Job | undefined> {
  await delay()
  const job = jobs.find((j) => j.id === id)
  return job ? structuredClone(job) : undefined
}

export interface NewJobInput {
  title: string
  details: string
  location: string
  date: string
  startTime: string
  durationHours: number
  crewNeeded: number
  postedBy: string
}

export async function createJob(input: NewJobInput): Promise<Job> {
  await delay()
  const job: Job = {
    id: uid(),
    ...input,
    status: 'open',
    volunteers: [],
  }
  jobs = [job, ...jobs]
  return structuredClone(job)
}

export async function addVolunteer(jobId: string, name: string): Promise<Job> {
  await delay()
  const idx = jobs.findIndex((j) => j.id === jobId)
  if (idx === -1) throw new Error('Job not found')
  const volunteer: Volunteer = {
    id: uid(),
    name: name.trim(),
    signedUpAt: new Date().toISOString(),
  }
  jobs[idx] = { ...jobs[idx], volunteers: [...jobs[idx].volunteers, volunteer] }
  return structuredClone(jobs[idx])
}

export async function removeVolunteer(jobId: string, volunteerId: string): Promise<Job> {
  await delay()
  const idx = jobs.findIndex((j) => j.id === jobId)
  if (idx === -1) throw new Error('Job not found')
  jobs[idx] = {
    ...jobs[idx],
    volunteers: jobs[idx].volunteers.filter((v) => v.id !== volunteerId),
  }
  return structuredClone(jobs[idx])
}

export async function markDone(jobId: string): Promise<Job> {
  await delay()
  const idx = jobs.findIndex((j) => j.id === jobId)
  if (idx === -1) throw new Error('Job not found')
  jobs[idx] = { ...jobs[idx], status: 'done' }
  return structuredClone(jobs[idx])
}
