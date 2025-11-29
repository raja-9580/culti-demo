'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Batch, BatchStatus } from '@/lib/types';
import Link from 'next/link';

const statusVariantMap: Record<BatchStatus, 'success' | 'warning' | 'info' | 'danger' | 'neutral'> = {
  [BatchStatus.Planned]: 'info',
  [BatchStatus.Sterilized]: 'warning',
  [BatchStatus.Inoculated]: 'warning',
  [BatchStatus.Colonising]: 'warning',
  [BatchStatus.ReadyToHarvest]: 'success',
  [BatchStatus.Archived]: 'neutral',
};

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default function RecentBatches({ batches }: { batches: Batch[] }) {
  const recent = batches.slice(0, 5);

  return (
    <Card variant="default" className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-100">🌾 Recent Batches</h3>
        <Link href="/batches" className="text-accent-leaf text-sm hover:text-accent-sky transition-colors">
          View all →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left py-3 px-3 font-semibold text-gray-300">
                Batch ID
              </th>
              <th className="text-left py-3 px-3 font-semibold text-gray-300">
                Type
              </th>
              <th className="text-left py-3 px-3 font-semibold text-gray-300">
                Baglets
              </th>
              <th className="text-left py-3 px-3 font-semibold text-gray-300">
                Status
              </th>
              <th className="text-left py-3 px-3 font-semibold text-gray-300">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {recent.map((batch) => (
              <tr
                key={batch.id}
                className="border-b border-gray-700/50 hover:bg-dark-surface-light/50 transition-colors"
              >
                <td className="py-4 px-3">
                  <Link href={`/batches/${batch.id}`} className="text-accent-leaf hover:text-accent-sky transition-colors">
                    {batch.id}
                  </Link>
                </td>
                <td className="py-4 px-3 text-gray-400 font-medium">{batch.mushroomType}</td>
                <td className="py-4 px-3 text-gray-400 font-medium">
                  {batch.actualBagletCount} / {batch.plannedBagletCount}
                </td>
                <td className="py-4 px-3">
                  <Badge variant={statusVariantMap[batch.status]}>
                    {batch.status}
                  </Badge>
                </td>
                <td className="py-4 px-3 text-gray-500">
                  {formatDate(batch.createdDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
