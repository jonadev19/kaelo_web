import { Card, CardContent } from '@/components/ui/Card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export function StatCard({ title, value, icon: Icon, trend, color = 'bg-blue-500' }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {trend && (
              <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% vs mes anterior
              </p>
            )}
          </div>
          <div className={`${color} p-4 rounded-lg`}>
            <Icon className="text-white" size={28} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
