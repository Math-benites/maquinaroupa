import type { CSSProperties } from 'react'

function Bar({ style }: { style?: CSSProperties }) {
  return <div className="skeleton" style={style} />
}

export function StatusCardSkeleton() {
  return (
    <div className="status-card status-card--skeleton">
      <Bar style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
      <div className="status-card__text">
        <Bar style={{ width: '55%', height: 16, marginBottom: 8 }} />
        <Bar style={{ width: '40%', height: 12 }} />
      </div>
    </div>
  )
}

export function TimelineSkeleton() {
  return (
    <div className="timeline">
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="timeline-row" key={i}>
          <Bar style={{ width: 12, height: 12, borderRadius: '50%', marginLeft: 10, flexShrink: 0 }} />
          <div className="slot-card slot-card--skeleton">
            <Bar style={{ width: 56, height: 16 }} />
            <Bar style={{ width: 78, height: 32, borderRadius: 10 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function OwnListSkeleton() {
  return (
    <div className="own-list">
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="own-card" key={i}>
          <div className="own-card__info" style={{ flex: 1 }}>
            <Bar style={{ width: '35%', height: 12, marginBottom: 8 }} />
            <Bar style={{ width: '55%', height: 18 }} />
          </div>
          <Bar style={{ width: 84, height: 36, borderRadius: 10, flexShrink: 0 }} />
        </div>
      ))}
    </div>
  )
}
