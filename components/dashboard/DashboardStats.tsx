import Card from '@/components/ui/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function DashboardStats({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {stats.map((stat, idx) => (
        <Card key={idx} variant="default" className="border-l-4 border-l-accent-leaf/60">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{stat.label}</p>
              <p className="text-3xl font-bold text-accent-leaf mt-3">
                {stat.value}
              </p>
            </div>
            {stat.icon && (
              <div className="text-4xl opacity-60">{stat.icon}</div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
