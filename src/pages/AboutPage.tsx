import { Hammer, Users, ClipboardCheck, Coffee } from 'lucide-react'

export function AboutPage() {
  return (
    <div className="page">
      <div className="page-head">
        <span className="eyebrow"><Hammer size={14} /> ABOUT DAD OPS</span>
        <h1 className="page-title">A crew of dads. A list of jobs.</h1>
        <p className="muted">
          Dad Ops is a small, committed sub-group of our school's Parents & Teachers
          community. When something around the school needs building, fixing, mowing,
          moving, or clearing — we're the blokes who pick up a tool and sort it.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <ClipboardCheck size={28} />
          <h3>Committee posts the job</h3>
          <p>
            The Parents Committee writes up what needs doing — where, when, and what
            to bring. Clear brief, no waffle.
          </p>
        </div>
        <div className="about-card">
          <Users size={28} />
          <h3>Dads sign on</h3>
          <p>
            Anyone can put a name down — first name, nickname, whatever you go by.
            More than one bloke per job. More hands, faster finish.
          </p>
        </div>
        <div className="about-card">
          <Hammer size={28} />
          <h3>Crew shows up</h3>
          <p>
            Bring the tools listed, work the hours posted, knock the job over
            together. Leave the place better than we found it.
          </p>
        </div>
        <div className="about-card">
          <Coffee size={28} />
          <h3>Job done</h3>
          <p>
            Mark it off the board, have a yarn, crack a cold one if the sun's over
            the yardarm. On to the next one.
          </p>
        </div>
      </div>
    </div>
  )
}
