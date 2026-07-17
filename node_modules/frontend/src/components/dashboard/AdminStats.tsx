import { useEffect, useState } from 'react';
import { getStats } from '@/lib/api';

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalTemplates: number;
  totalRevenue: number;
  pendingOrders: number;
  inProductionOrders: number;
  deliveredOrders: number;
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.stats))
      .catch(() => {
        // Fallback mock stats when backend isn't connected
        setStats({
          totalUsers: 0, totalOrders: 0, totalTemplates: 0,
          totalRevenue: 0, pendingOrders: 0, inProductionOrders: 0, deliveredOrders: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5 rounded-lg animate-pulse">
            <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
            <div className="h-7 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-2 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      sub: 'All completed orders',
      highlight: true,
      icon: '💰',
    },
    {
      label: 'Active Orders',
      value: stats?.totalOrders || 0,
      sub: `${stats?.pendingOrders || 0} pending approval`,
      icon: '📦',
    },
    {
      label: 'In Production',
      value: stats?.inProductionOrders || 0,
      sub: 'Currently printing',
      icon: '🖨️',
    },
    {
      label: 'Registered Clients',
      value: stats?.totalUsers || 0,
      sub: `${stats?.totalTemplates || 0} templates live`,
      icon: '👥',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className={`${card.highlight ? 'glass-card-gold' : 'glass-card'} p-5 rounded-lg space-y-1`}>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{card.label}</p>
            <span className="text-lg">{card.icon}</span>
          </div>
          <h3 className={`text-2xl font-bold ${card.highlight ? 'text-luxury-gold' : 'text-luxury-accent'}`}>
            {card.value}
          </h3>
          <p className="text-[9px] text-gray-500">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
