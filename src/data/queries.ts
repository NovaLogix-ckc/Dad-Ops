import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addVolunteer,
  createJob,
  getJob,
  listJobs,
  markDone,
  removeVolunteer,
  type NewJobInput,
} from './store'

export const jobsQuery = () =>
  queryOptions({
    queryKey: ['jobs'],
    queryFn: listJobs,
  })

export const jobQuery = (id: string) =>
  queryOptions({
    queryKey: ['jobs', id],
    queryFn: () => getJob(id),
  })

export function useCreateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: NewJobInput) => createJob(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

export function useAddVolunteer(jobId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => addVolunteer(jobId, name),
    onSuccess: (job) => {
      qc.setQueryData(['jobs', jobId], job)
      qc.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

export function useRemoveVolunteer(jobId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (volunteerId: string) => removeVolunteer(jobId, volunteerId),
    onSuccess: (job) => {
      qc.setQueryData(['jobs', jobId], job)
      qc.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

export function useMarkDone(jobId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => markDone(jobId),
    onSuccess: (job) => {
      qc.setQueryData(['jobs', jobId], job)
      qc.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}
