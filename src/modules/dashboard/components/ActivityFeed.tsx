import { Card }   from '../../../components/ui/Card'
import { Avatar } from '../../../components/ui/Avatar'
import { Badge }  from '../../../components/ui/Badge'
import type { ActivityItem } from '../types'

interface ActivityFeedProps {
  activities: ActivityItem[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card title="Recent Activity">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {activities.map((item) => (
          <div
            key={item.id}
            style={{
              display:        'flex',
              alignItems:     'flex-start',
              gap:            'var(--space-4)',
              paddingBottom:  'var(--space-3)',
              borderBottom:   '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Avatar name={item.user.name} src={item.user.avatarUrl} size="sm" />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>
                  {item.user.name} — <span style={{ fontWeight: 'var(--weight-medium)' }}>{item.title}</span>
                </p>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                  {item.timestamp}
                </span>
              </div>

              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>
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
