import { Card }   from '../../../components/ui/Card'
import { Avatar } from '../../../components/ui/Avatar'
import { Badge }  from '../../../components/ui/Badge'
import type { ActivityItem } from '../types'

interface ActivityFeedProps {
  activities: ActivityItem[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card title="Live Activity Stream">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {activities.map((item) => (
          <div
            key={item.id}
            style={{
              position:       'relative',
              display:        'flex',
              alignItems:     'flex-start',
              gap:            '1rem',
              padding:        '0.75rem',
              borderRadius:   '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border:         '1px solid rgba(255, 255, 255, 0.04)',
              transition:     'background-color 0.2s ease',
            }}
          >
            <Avatar name={item.user.name} src={item.user.avatarUrl} size="md" />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                  {item.user.name}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {item.timestamp}
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 500, margin: '0.15rem 0' }}>
                {item.title}
              </p>

              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.subtitle}
              </p>
            </div>

            {item.status && (
              <Badge variant={item.status} size="sm">
                {item.type.replace('_', ' ')}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
