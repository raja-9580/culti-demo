'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import QRLabelGrid from '@/components/batches/QRLabelGrid';
import { BatchStatus, Batch } from '@/lib/types';
import Link from 'next/link';

const statusVariantMap: Record<BatchStatus, 'success' | 'warning' | 'info' | 'danger' | 'neutral'> = {
  [BatchStatus.Planned]: 'info',
  [BatchStatus.Sterilized]: 'warning',
  [BatchStatus.Inoculated]: 'warning',
  [BatchStatus.Colonising]: 'warning',
  [BatchStatus.ReadyToHarvest]: 'success',
  [BatchStatus.Archived]: 'neutral',
};

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default function BatchDetailPage({
  params,
}: {
  params: { id: string };
}) {
  console.log('BatchDetailPage mounted with params:', params);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBatch() {
      try {
        const res = await fetch('/api/batches');
        const data = await res.json();
        if (data.batches) {
          const found = data.batches.find((b: Batch) => b.id === params.id);
          setBatch(found || null);
        }
      } catch (error) {
        console.error('Failed to fetch batch:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBatch();
  }, [params.id]);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading batch details...</div>;
  }

  if (!batch) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Batch Not Found</h1>
        <Link href="/batches">
          <Button variant="primary">← Back to Batches</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/batches">
          <Button variant="ghost" size="sm">
            ← Back to Batches
          </Button>
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-leaf to-accent-sky bg-clip-text text-transparent mt-4">🌾 {batch.id}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card variant="default">
          <p className="text-xs text-gray-400 mb-1">Mushroom Type</p>
          <p className="text-xl font-semibold text-accent-leaf">
            {batch.mushroomType}
          </p>
        </Card>
        <Card variant="default">
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <Badge variant={statusVariantMap[batch.status]}>
            {batch.status}
          </Badge>
        </Card>
        <Card variant="default">
          <p className="text-xs text-gray-400 mb-1">Baglets</p>
          <p className="text-xl font-semibold text-accent-leaf">
            {batch.actualBagletCount} / {batch.plannedBagletCount}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card variant="default">
          <p className="text-sm font-semibold text-gray-300 mb-3">Details</p>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-gray-400">Substrate Code:</p>
              <p className="text-gray-200">{batch.substrateCode}</p>
            </div>
            <div>
              <p className="text-gray-400">Substrate Description:</p>
              <p className="text-gray-200">{batch.substrateDescription}</p>
            </div>
            <div>
              <p className="text-gray-400">Created Date:</p>
              <p className="text-gray-200">
                {formatDate(batch.createdDate)}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Prepared Date:</p>
              <p className="text-gray-200">
                {formatDate(batch.preparedDate)}
              </p>
            </div>
            {batch.notes && (
              <div>
                <p className="text-gray-400">Notes:</p>
                <p className="text-gray-200">{batch.notes}</p>
              </div>
            )}
          </div>
        </Card>

        <Card variant="default">
          <p className="text-sm font-semibold text-gray-300 mb-3">Actions</p>
          <div className="space-y-2">
            <Button variant="secondary" className="w-full">
              📝 Add Baglets
            </Button>
            <Button variant="secondary" className="w-full">
              📝 Update Status
            </Button>
            <Button variant="secondary" className="w-full">
              🔗 View All Baglets
            </Button>
          </div>
        </Card>
      </div>

      <QRLabelGrid batchId={batch.id} />
    </div>
  );
}
