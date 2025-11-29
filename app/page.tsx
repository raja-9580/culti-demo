'use client';

import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentBatches from '@/components/dashboard/RecentBatches';
import RecentBaglets from '@/components/dashboard/RecentBaglets';
import { mockBatches, mockBaglets } from '@/lib/mock-data';
import { BatchStatus, BagletStatus } from '@/lib/types';

export default function DashboardPage() {
  // Calculate KPI stats
  const totalBatches = mockBatches.length;
  const activeBatches = mockBatches.filter(
    (b) => ![BatchStatus.Archived, BatchStatus.ReadyToHarvest].includes(b.status)
  ).length;
  const totalBaglets = mockBaglets.length;
  const bagletsWaitingForSterilization = mockBaglets.filter(
    (b) => b.status === BagletStatus.Planned
  ).length;

  const stats = [
    { label: 'Total Batches', value: totalBatches, icon: '🌾' },
    { label: 'Active Batches', value: activeBatches, icon: '⚡' },
    { label: 'Total Baglets', value: totalBaglets, icon: '📦' },
    { label: 'Ready to Harvest', value: mockBatches.filter((b) => b.status === BatchStatus.ReadyToHarvest).length, icon: '🎯' },
  ];

  return (
    <div>
      <DashboardStats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <RecentBatches batches={mockBatches} />
        </div>
        <div>
          <RecentBaglets baglets={mockBaglets} />
        </div>
      </div>
    </div>
  );
}
