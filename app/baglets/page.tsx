'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { mockBaglets } from '@/lib/mock-data';
import { BagletStatus } from '@/lib/types';
import Link from 'next/link';

const statusVariantMap: Record<BagletStatus, 'success' | 'warning' | 'info' | 'danger' | 'neutral'> = {
  [BagletStatus.Planned]: 'info',
  [BagletStatus.Sterilized]: 'warning',
  [BagletStatus.Inoculated]: 'warning',
  [BagletStatus.Colonising]: 'warning',
  [BagletStatus.ReadyToHarvest]: 'success',
  [BagletStatus.Harvested]: 'neutral',
};

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default function BagletsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-leaf to-accent-sky bg-clip-text text-transparent">📦 Baglets</h1>
      </div>

      {/* Baglets Table */}
      <Card variant="default">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Baglet ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Batch ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Last Update
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Metrics
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockBaglets.map((baglet) => (
                <tr
                  key={baglet.id}
                  className="border-b border-gray-700/50 hover:bg-dark-surface-light/50 transition-colors"
                >
                  <td className="py-4 px-4 text-accent-leaf font-medium">{baglet.id}</td>
                  <td className="py-4 px-4">
                    <Link href="/batches" className="text-gray-400 hover:text-accent-leaf hover:text-accent-sky transition-colors">
                      {baglet.batchId}
                    </Link>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={statusVariantMap[baglet.status]}>
                      {baglet.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-gray-500 text-xs">
                    {formatDate(baglet.lastStatusChange)}
                  </td>
                  <td className="py-4 px-4 text-gray-500 text-xs leading-relaxed">
                    {baglet.metrics
                      ? (
                          <div>
                            <div>{baglet.metrics.temperature}°C</div>
                            <div>{baglet.metrics.co2Level} ppm</div>
                          </div>
                        )
                      : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" disabled>
                      + Metric
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
