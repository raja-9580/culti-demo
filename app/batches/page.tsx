'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { mockBatches } from '@/lib/mock-data';
import { MUSHROOM_TYPES, BatchStatus } from '@/lib/types';
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

export default function BatchesPage() {
  const [filters, setFilters] = useState({
    mushroomType: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  const filteredBatches = mockBatches.filter((batch) => {
    if (filters.mushroomType && batch.mushroomType !== filters.mushroomType) {
      return false;
    }
    if (filters.status && batch.status !== filters.status) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-leaf to-accent-sky bg-clip-text text-transparent">🌾 Batches</h1>
        <Button variant="primary">+ Create Batch</Button>
      </div>

      {/* Filters */}
      <Card variant="default" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Mushroom Type"
            options={[
              { value: '', label: 'All Types' },
              ...MUSHROOM_TYPES.map((type) => ({ value: type, label: type })),
            ]}
            value={filters.mushroomType}
            onChange={(e) =>
              setFilters({ ...filters, mushroomType: e.target.value })
            }
          />
          <Select
            label="Status"
            options={[
              { value: '', label: 'All Statuses' },
              ...Object.values(BatchStatus).map((status) => ({
                value: status,
                label: status,
              })),
            ]}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          />
          <Input
            label="From Date"
            type="date"
            value={filters.dateFrom}
            onChange={(e) =>
              setFilters({ ...filters, dateFrom: e.target.value })
            }
          />
          <Input
            label="To Date"
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          />
        </div>
      </Card>

      {/* Batches Table */}
      <Card variant="default">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Batch ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Substrate
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Baglets
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Created
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch) => (
                <tr
                  key={batch.id}
                  className="border-b border-gray-700/50 hover:bg-dark-surface-light/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <Link href={`/batches/${batch.id}`} className="text-accent-leaf hover:text-accent-sky transition-colors">
                      {batch.id}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-gray-400 font-medium">{batch.mushroomType}</td>
                  <td className="py-4 px-4 text-gray-500 text-sm">
                    {batch.substrateCode}
                  </td>
                  <td className="py-4 px-4 text-gray-400 font-medium">
                    {batch.actualBagletCount} / {batch.plannedBagletCount}
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={statusVariantMap[batch.status]}>
                      {batch.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-gray-500">
                    {formatDate(batch.createdDate)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                      <Button variant="ghost" size="sm">
                        QR
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBatches.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No batches found matching your filters.
          </div>
        )}
      </Card>
    </div>
  );
}
