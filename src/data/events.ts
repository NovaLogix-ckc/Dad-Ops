export type EventStatus = 'open' | 'done'

// How volunteers sign up for an event:
//   'open'      - one shared bucket of slots, fill by name
//   'jobs'      - named jobs (BBQ, Setup, Pack-down) each with their own capacity
//   'scheduled' - named jobs with multiple time slots (e.g. BBQ 6pm/7pm/8pm)
export type SignupStyle = 'open' | 'jobs' | 'scheduled'

export interface Volunteer {
  id: string
  name: string
  signedUpAt: string
}

export interface Slot {
  id: string
  startTime?: string // HH:mm — only used for 'scheduled' events
  endTime?: string   // HH:mm
  capacity: number
  volunteers: Volunteer[]
}

export interface EventJob {
  id: string
  name: string          // for 'open' style this is just a label like "Crew"
  description?: string
  slots: Slot[]         // 'open' & 'jobs' have exactly one; 'scheduled' has many
}

export interface OpsEvent {
  id: string
  title: string
  details: string
  location: string
  date: string          // ISO date
  startTime?: string    // overall event window, display-only
  endTime?: string
  postedBy: string
  status: EventStatus
  signupStyle: SignupStyle
  jobs: EventJob[]
}

const today = new Date()
const iso = (daysFromNow: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().slice(0, 10)
}
const now = () => new Date().toISOString()

export const seedEvents: OpsEvent[] = [
  {
    id: 'working-bee',
    title: 'Term 2 working bee',
    details:
      'General tidy-up around the school grounds — weeding, mulching, gutter clean, a bit of painting if we have numbers. Bring your own gloves and a rake if you have one. Snags and coffee provided.',
    location: 'Meet at the staff car park',
    date: iso(5),
    startTime: '08:00',
    endTime: '12:00',
    postedBy: 'Parents Committee — Sarah K.',
    status: 'open',
    signupStyle: 'open',
    jobs: [
      {
        id: 'j-wb-crew',
        name: 'Crew',
        slots: [
          {
            id: 's-wb-1',
            capacity: 20,
            volunteers: [
              { id: 'v1', name: 'Dave M.', signedUpAt: now() },
              { id: 'v2', name: 'Big Tony', signedUpAt: now() },
              { id: 'v3', name: 'Stevo', signedUpAt: now() },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'bbq-build',
    title: 'Build the new BBQ shelter',
    details:
      'Pouring footings and framing up the roof for the covered BBQ area. Timber and fixings supplied — bring cordless drills, levels, and a good attitude.',
    location: 'Senior playground — back fence',
    date: iso(9),
    startTime: '08:00',
    endTime: '14:00',
    postedBy: 'Parents Committee — Mike R.',
    status: 'open',
    signupStyle: 'jobs',
    jobs: [
      {
        id: 'j-bbq-concrete',
        name: 'Concrete & footings',
        description: 'Mix, pour, level. Heavy morning.',
        slots: [
          {
            id: 's-bbq-c',
            capacity: 3,
            volunteers: [{ id: 'v4', name: 'Dave M.', signedUpAt: now() }],
          },
        ],
      },
      {
        id: 'j-bbq-frame',
        name: 'Framing crew',
        description: 'Stud the walls, set the rafters.',
        slots: [
          {
            id: 's-bbq-f',
            capacity: 4,
            volunteers: [
              { id: 'v5', name: 'Big Tony', signedUpAt: now() },
              { id: 'v6', name: 'Kenny', signedUpAt: now() },
            ],
          },
        ],
      },
      {
        id: 'j-bbq-roof',
        name: 'Roofing',
        description: 'Colorbond sheets, flashings, screws.',
        slots: [
          {
            id: 's-bbq-r',
            capacity: 2,
            volunteers: [],
          },
        ],
      },
    ],
  },
  {
    id: 'school-disco',
    title: 'School disco — crew roster',
    details:
      'The annual glow-stick disco. We need blokes on the BBQ, on the door, and on pack-down. Sessions are short — grab an hour, hand over, enjoy the rest of the night.',
    location: 'School hall & quadrangle',
    date: iso(14),
    startTime: '17:30',
    endTime: '21:30',
    postedBy: 'Parents Committee — Janelle P.',
    status: 'open',
    signupStyle: 'scheduled',
    jobs: [
      {
        id: 'j-disco-bbq',
        name: 'BBQ',
        description: 'Two on the grill, one on buns and sauce.',
        slots: [
          {
            id: 's-bbq-6',
            startTime: '18:00',
            endTime: '19:00',
            capacity: 3,
            volunteers: [
              { id: 'v7', name: 'Dave M.', signedUpAt: now() },
              { id: 'v8', name: 'Stevo', signedUpAt: now() },
            ],
          },
          {
            id: 's-bbq-7',
            startTime: '19:00',
            endTime: '20:00',
            capacity: 3,
            volunteers: [{ id: 'v9', name: 'Big Tony', signedUpAt: now() }],
          },
          {
            id: 's-bbq-8',
            startTime: '20:00',
            endTime: '21:00',
            capacity: 3,
            volunteers: [],
          },
        ],
      },
      {
        id: 'j-disco-door',
        name: 'Door & tickets',
        description: 'Greet, tick off names, direct traffic.',
        slots: [
          {
            id: 's-door-1',
            startTime: '17:30',
            endTime: '18:30',
            capacity: 2,
            volunteers: [{ id: 'v10', name: 'Kenny', signedUpAt: now() }],
          },
          {
            id: 's-door-2',
            startTime: '18:30',
            endTime: '19:30',
            capacity: 2,
            volunteers: [],
          },
        ],
      },
      {
        id: 'j-disco-packdown',
        name: 'Pack-down',
        description: 'Chairs, tables, bins, lost property.',
        slots: [
          {
            id: 's-pack',
            startTime: '21:00',
            endTime: '22:00',
            capacity: 4,
            volunteers: [],
          },
        ],
      },
    ],
  },
  {
    id: 'field-mow',
    title: 'Mow the lower field before sports day',
    details:
      'Ride-on is in the shed. A full pass plus the edges along the bike track. Two blokes, solid morning.',
    location: 'Lower sports field',
    date: iso(3),
    startTime: '07:30',
    endTime: '10:30',
    postedBy: 'Parents Committee — Mike R.',
    status: 'open',
    signupStyle: 'open',
    jobs: [
      {
        id: 'j-mow',
        name: 'Crew',
        slots: [{ id: 's-mow', capacity: 2, volunteers: [] }],
      },
    ],
  },
  {
    id: 'fete-packdown',
    title: 'Fete pack-down crew',
    details:
      'Tables, marquees, signage, and rubbish wrangling. Many hands make light work.',
    location: 'Front quadrangle',
    date: iso(-3),
    postedBy: 'Parents Committee — Mike R.',
    status: 'done',
    signupStyle: 'open',
    startTime: '16:00',
    endTime: '18:00',
    jobs: [
      {
        id: 'j-fete',
        name: 'Crew',
        slots: [
          {
            id: 's-fete',
            capacity: 8,
            volunteers: [
              { id: 'v11', name: 'Dave M.', signedUpAt: now() },
              { id: 'v12', name: 'Big Tony', signedUpAt: now() },
              { id: 'v13', name: 'Stevo', signedUpAt: now() },
              { id: 'v14', name: 'Kenny', signedUpAt: now() },
            ],
          },
        ],
      },
    ],
  },
]

// ---- derived helpers ---------------------------------------------------

export function countFilled(event: OpsEvent): { filled: number; capacity: number } {
  let filled = 0
  let capacity = 0
  for (const job of event.jobs) {
    for (const slot of job.slots) {
      filled += slot.volunteers.length
      capacity += slot.capacity
    }
  }
  return { filled, capacity }
}

export function slotIsFull(slot: Slot): boolean {
  return slot.volunteers.length >= slot.capacity
}

export function formatSlotWindow(slot: Slot): string | null {
  if (!slot.startTime) return null
  if (slot.endTime) return `${slot.startTime}–${slot.endTime}`
  return slot.startTime
}
