import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { PlusCircle, Wrench, ClipboardList, CheckCircle2 } from 'lucide-react'
import { jobsQuery } from '../data/queries'
import { JobCard } from '../components/JobCard'

export function JobsPage() {
  const { data: jobs = [], isLoading } = useQuery(jobsQuery())

  const open = jobs.filter((j) => j.status !== 'done')
  const done = jobs.filter((j) => j.status === 'done')

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Wrench size={14} /> DAD OPS · JOB BOARD</span>
          <h1 className="hero-title">Pick up a tool. Pick up a job.</h1>
          <p className="hero-sub">
            The Parents & Teachers Committee posts what needs doing. You put your name
            down. We show up, knock it over, and head home.
          </p>
          <div className="hero-actions">
            <Link to="/new" className="btn btn-primary">
              <PlusCircle size={18} /> Post a job
            </Link>
            <a href="#open-jobs" className="btn btn-ghost">
              <ClipboardList size={18} /> See what needs doing
            </a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">{open.length}</span>
            <span className="stat-label">Jobs open</span>
          </div>
          <div className="stat">
            <span className="stat-num">
              {open.reduce((n, j) => n + j.volunteers.length, 0)}
            </span>
            <span className="stat-label">Dads signed on</span>
          </div>
          <div className="stat">
            <span className="stat-num">{done.length}</span>
            <span className="stat-label">Jobs done</span>
          </div>
        </div>
      </section>

      <section id="open-jobs" className="section">
        <div className="section-head">
          <h2 className="section-title"><ClipboardList size={20} /> Open jobs</h2>
          <span className="section-count">{open.length}</span>
        </div>
        {isLoading ? (
          <p className="muted">Loading the roster…</p>
        ) : open.length === 0 ? (
          <div className="empty-card">
            <p>No jobs on the board. The toolbelt is hung up — for now.</p>
          </div>
        ) : (
          <div className="job-grid">
            {open.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {done.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="section-title"><CheckCircle2 size={20} /> Jobs done</h2>
            <span className="section-count">{done.length}</span>
          </div>
          <div className="job-grid">
            {done.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
