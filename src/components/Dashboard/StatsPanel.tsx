import React from 'react';
import { Users, Clock, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { PilgrimStats } from '../../types/dashboard';

interface StatsPanelProps {
  stats: PilgrimStats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Pilgrims',
      value: stats.totalPilgrims.toLocaleString(),
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Current in Area',
      value: stats.currentInArea.toLocaleString(),
      icon: Activity,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Peak Today',
      value: stats.peakToday.toLocaleString(),
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    {
      title: 'Avg Response Time',
      value: `${stats.avgResponseTime.toFixed(1)} min`,
      icon: Clock,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/20'
    },
    {
      title: 'Active Incidents',
      value: stats.activeIncidents.toString(),
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    },
    {
      title: 'Resolved Today',
      value: stats.resolvedIncidents.toString(),
      icon: CheckCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20'
    }
  ];

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Live Statistics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-2">
                <IconComponent className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs text-slate-400 uppercase tracking-wider">Live</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-300">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};