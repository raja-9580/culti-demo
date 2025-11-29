'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
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
  const [showFilters, setShowFilters] = useState(false);

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
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <h1 className="text-xl md:text-2xl font-semibold text-accent-leaf">Batches</h1>
        <Button variant="primary" className="hidden md:inline-flex">Create Batch</Button>
      </div>

      {/* Filters */}
      <Card className="mb-4 md:mb-5 border border-gray-800/30 p-3 md:p-4">
        <div className="flex items-center justify-between lg:hidden mb-3">
          <span className="text-xs md:text-sm font-medium text-gray-300">Filters</span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            {showFilters ? '▼' : '▶'}
          </button>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 ${!showFilters && 'hidden lg:grid'}`}>
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
      <Card className="border border-gray-800/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-800/20 bg-dark-surface-light/60 backdrop-blur-sm">
                <th className="text-left py-2.5 md:py-3 px-2 md:px-4 font-semibold text-gray-200 text-xs">
                  Batch ID
                </th>
                <th className="text-left py-2.5 md:py-3 px-2 md:px-4 font-semibold text-gray-200 text-xs">
                  Type
                </th>
                <th className="text-left py-2.5 md:py-3 px-2 md:px-4 font-semibold text-gray-200 text-xs hidden md:table-cell">
                  Substrate
                </th>
                <th className="text-left py-2.5 md:py-3 px-2 md:px-4 font-semibold text-gray-200 text-xs hidden lg:table-cell">
                  Baglets
                </th>
                <th className="text-left py-2.5 md:py-3 px-2 md:px-4 font-semibold text-gray-200 text-xs">
                  Status
                </th>
                <th className="text-left py-2.5 md:py-3 px-2 md:px-4 font-semibold text-gray-200 text-xs hidden md:table-cell">
                  Created
                </th>
                <th className="text-left py-2.5 md:py-3 px-2 md:px-4 font-semibold text-gray-200 text-xs">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch) => (
                <tr
                  key={batch.id}
                  className="border-b border-gray-800/20 hover:bg-dark-surface-light/20 transition-colors"
                >
                  <td className="py-3 md:py-3.5 px-2 md:px-4">
                    <Link href={`/batches/${batch.id}`} className="text-accent-leaf hover:text-accent-sky transition-colors text-xs md:text-sm font-medium">
                      {batch.id}
                    </Link>
                  </td>
                  <td className="py-3 md:py-3.5 px-2 md:px-4 text-gray-400 text-xs md:text-sm font-medium">{batch.mushroomType}</td>
                  <td className="py-3 md:py-3.5 px-2 md:px-4 text-gray-500 text-xs md:text-sm hidden md:table-cell">
                    {batch.substrateCode}
                  </td>
                  <td className="py-3 md:py-3.5 px-2 md:px-4 text-gray-400 text-xs md:text-sm font-medium hidden lg:table-cell">
                    {batch.actualBagletCount} / {batch.plannedBagletCount}
                  </td>
                  <td className="py-3 md:py-3.5 px-2 md:px-4">
                    <Badge variant={statusVariantMap[batch.status]}>
                      {batch.status}
                    </Badge>
                  </td>
                  <td className="py-3 md:py-3.5 px-2 md:px-4 text-gray-500 text-xs md:text-sm hidden md:table-cell">
                    {formatDate(batch.createdDate)}
                  </td>
                  <td className="py-2 md:py-3 px-2 md:px-4">
                    <div className="flex gap-1 md:gap-2">
                      <Button variant="ghost" size="sm" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5">
                        Details
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 hidden md:inline-flex">
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
          <div className="text-center py-8 text-gray-400 text-sm">
            No batches found matching your filters.
          </div>
        )}
      </Card>
      
      <FloatingActionButton actions={[
        { label: 'Create Batch', icon: '➕', href: '/batches' },
        { label: 'QR Scan', icon: '📱', href: '/batches' },
      ]} />
    </div>
  );
}
