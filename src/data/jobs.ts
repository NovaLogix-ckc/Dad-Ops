export type JobStatus = 'open' | 'in-progress' | 'done'

export interface Volunteer {
  id: string
  name: string
  signedUpAt: string
}

export interface Job {
  id: string
  title: string
  details: string
  location: string
  date: string // ISO date
  startTime: string // HH:mm
  durationHours: number
  crewNeeded: number
  postedBy: string
  status: JobStatus
  volunteers: Volunteer[]
}

const now = new Date()
const iso = (daysFromNow: number) => {
  const d = new Date(now)
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().slice(0, 10)
}

export const seedJobs: Job[] = [
  {
    id: 'bbq-build',
    title: 'Build the new BBQ shelter',
    details:
      'Pouring footings and framing up the roof for the covered BBQ area near the senior playground. Bring cordless drills and a level if you have one. Timber and fixings supplied.',
    location: 'Senior playground — back fence',
    date: iso(3),
    startTime: '08:00',
    durationHours: 4,
    crewNeeded: 6,
    postedBy: 'Parents Committee — Sarah K.',
    status: 'open',
    volunteers: [
      { id: 'v1', name: 'Dave M.', signedUpAt: new Date().toISOString() },
      { id: 'v2', name: 'Big Tony', signedUpAt: new Date().toISOString() },
    ],
  },
  {
    id: 'field-mow',
    title: 'Mow the lower field before sports day',
    details:
      'The ride-on is in the shed, key in the usual spot. Needs a full pass plus the edges along the bike track. Should take two blokes a solid morning.',
    location: 'Lower sports field',
    date: iso(6),
    startTime: '07:30',
    durationHours: 3,
    crewNeeded: 2,
    postedBy: 'Parents Committee — Mike R.',
    status: 'open',
    volunteers: [],
  },
  {
    id: 'shed-clearout',
    title: 'Clear out the old sports shed',
    details:
      'Full clean-out, tip run with the trailer, and reorganise the shelving. Heavy lifting — wear boots. Ute and trailer appreciated.',
    location: 'Sports shed, behind the hall',
    date: iso(10),
    startTime: '09:00',
    durationHours: 5,
    crewNeeded: 4,
    postedBy: 'Parents Committee — Janelle P.',
    status: 'open',
    volunteers: [
      { id: 'v3', name: 'Stevo', signedUpAt: new Date().toISOString() },
    ],
  },
  {
    id: 'garden-beds',
    title: 'Build raised garden beds for Room 4',
    details:
      'Four 2.4m raised beds from sleepers. Mitre saw on site, sleepers delivered Friday. Room 4 kids will help fill them the following week.',
    location: 'Room 4 courtyard',
    date: iso(14),
    startTime: '08:30',
    durationHours: 4,
    crewNeeded: 5,
    postedBy: 'Parents Committee — Sarah K.',
    status: 'open',
    volunteers: [],
  },
  {
    id: 'fete-pack-down',
    title: 'Fete pack-down crew',
    details:
      'Tables, marquees, signage, and rubbish wrangling. Many hands make light work — come for an hour or stay for the lot.',
    location: 'Front quadrangle',
    date: iso(-2),
    startTime: '16:00',
    durationHours: 2,
    crewNeeded: 8,
    postedBy: 'Parents Committee — Mike R.',
    status: 'done',
    volunteers: [
      { id: 'v4', name: 'Dave M.', signedUpAt: new Date().toISOString() },
      { id: 'v5', name: 'Big Tony', signedUpAt: new Date().toISOString() },
      { id: 'v6', name: 'Stevo', signedUpAt: new Date().toISOString() },
      { id: 'v7', name: 'Kenny', signedUpAt: new Date().toISOString() },
    ],
  },
]
