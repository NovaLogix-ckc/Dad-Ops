import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createEvent,
  getEvent,
  listEvents,
  markDone,
  removeVolunteer,
  signUp,
  type NewEventInput,
} from './store'

export const eventsQuery = () =>
  queryOptions({
    queryKey: ['events'],
    queryFn: listEvents,
  })

export const eventQuery = (id: string) =>
  queryOptions({
    queryKey: ['events', id],
    queryFn: () => getEvent(id),
  })

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: NewEventInput) => createEvent(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

interface SignUpArgs {
  jobId: string
  slotId: string
  name: string
}

export function useSignUp(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ jobId, slotId, name }: SignUpArgs) =>
      signUp(eventId, jobId, slotId, name),
    onSuccess: (event) => {
      qc.setQueryData(['events', eventId], event)
      qc.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

interface RemoveArgs {
  jobId: string
  slotId: string
  volunteerId: string
}

export function useRemoveVolunteer(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ jobId, slotId, volunteerId }: RemoveArgs) =>
      removeVolunteer(eventId, jobId, slotId, volunteerId),
    onSuccess: (event) => {
      qc.setQueryData(['events', eventId], event)
      qc.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useMarkDone(eventId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => markDone(eventId),
    onSuccess: (event) => {
      qc.setQueryData(['events', eventId], event)
      qc.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
