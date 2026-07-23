import { IndianRupee, HandCoins, Navigation, Handshake } from 'lucide-react'
import { StatCard } from '../../../components/ui/StatCard'
import type { DashboardMetrics } from '../types'

interface MetricGridProps {
  metrics: DashboardMetrics
}

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div
      style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
        gap:                 '0.875rem',
        width:               '100%',
      }}
    >
      <StatCard
        title="Total POS Portfolio"
        value="₹1.48 Cr"
        color="primary"
        icon={<IndianRupee size={18} />}
        trend={{ value: 12.4, direction: 'up', label: 'mo growth' }}
      />

      <StatCard
        title="Collections Today"
        value="₹42,500"
        color="success"
        icon={<HandCoins size={18} />}
        trend={{ value: 88.5, direction: 'up', label: 'target' }}
      />

      <StatCard
        title="FOS Active On Field"
        value={metrics.activeVisits || 12}
        color="warning"
        icon={<Navigation size={18} />}
      />

      <StatCard
        title="Active PTP Pipeline"
        value="18 PTPs"
        color="error"
        icon={<Handshake size={18} />}
      />
    </div>
  )
}
