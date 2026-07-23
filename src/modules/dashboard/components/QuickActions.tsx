import { useNavigate } from 'react-router-dom'
import { UserPlus, MapPin, CalendarPlus, FileText } from 'lucide-react'
import { useAuthStore } from '../../../stores/useAuthStore'
import { Card }   from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'

export function QuickActions() {
  const navigate = useNavigate()
  const user     = useAuthStore((s) => s.user)
  const isAdmin  = user?.role === 'admin'

  return (
    <Card title="Quick Shortcuts">
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap:                 'var(--space-3)',
        }}
      >
        {isAdmin && (
          <Button
            variant="secondary"
            size="md"
            leftIcon={<UserPlus size={16} color="var(--color-primary-400)" />}
            onClick={() => navigate('/employees')}
            style={{ justifyContent: 'flex-start', height: '3rem' }}
          >
            Add New Employee
          </Button>
        )}

        <Button
          variant="secondary"
          size="md"
          leftIcon={<MapPin size={16} color="#fbbf24" />}
          onClick={() => navigate('/field-visits')}
          style={{ justifyContent: 'flex-start', height: '3rem' }}
        >
          Assign Field Visit
        </Button>

        <Button
          variant="secondary"
          size="md"
          leftIcon={<CalendarPlus size={16} color="#4ade80" />}
          onClick={() => navigate('/leaves')}
          style={{ justifyContent: 'flex-start', height: '3rem' }}
        >
          Apply for Leave
        </Button>

        <Button
          variant="secondary"
          size="md"
          leftIcon={<FileText size={16} color="#38bdf8" />}
          onClick={() => navigate('/attendance')}
          style={{ justifyContent: 'flex-start', height: '3rem' }}
        >
          View Attendance Log
        </Button>
      </div>
    </Card>
  )
}
