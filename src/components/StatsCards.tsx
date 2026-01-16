'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogStore } from '@/store/useLogStore';
import { useLocaleStore } from '@/store/useLocaleStore';

export function StatsCards() {
  const stats = useLogStore((s) => s.stats);
  const t = useLocaleStore((s) => s.t);

  const cards = [
    { title: t.stats.totalErrors, value: stats.total, icon: 'mdi:alert-circle-outline', color: 'text-red-500' },
    { title: t.stats.apiErrors, value: stats.apiErrors, icon: 'mdi:api-off', color: 'text-orange-500' },
    {
      title: t.stats.remoteErrors,
      value: stats.remoteErrors,
      icon: 'mdi:connection',
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <iconify-icon icon={card.icon} width="20" height="20" className={card.color} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
