'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { APP_CONFIG } from '@/lib/config';

interface Strain {
    strain_code: string;
    mushroom_id: string;
    mushroom_name: string;
    strain_vendor_id: string;
    vendor_name: string;
}

interface Substrate {
    substrate_id: string;
    substrate_name: string;
    mediums: any[];
    supplements: any[];
}

interface CreateBatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateBatchModal({ isOpen, onClose, onSuccess }: CreateBatchModalProps) {
    const [strains, setStrains] = useState<Strain[]>([]);
    const [substrates, setSubstrates] = useState<Substrate[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        strain_code: '',
        substrate_id: '',
        prepared_date: new Date().toISOString().split('T')[0],
        baglet_count: APP_CONFIG.DEFAULT_BAGLET_COUNT,
        created_by: 'user@example.com', // TODO: Get from auth
    });

    useEffect(() => {
        if (isOpen) {
            fetchStrains();
            fetchSubstrates();
        }
    }, [isOpen]);

    async function fetchStrains() {
        try {
            const res = await fetch('/api/strains');
            const data = await res.json();
            if (data.strains) {
                setStrains(data.strains);
            }
        } catch (error) {
            console.error('Failed to fetch strains:', error);
        }
    }

    async function fetchSubstrates() {
        try {
            const res = await fetch('/api/substrates');
            const data = await res.json();
            if (data.substrates) {
                setSubstrates(data.substrates);
            }
        } catch (error) {
            console.error('Failed to fetch substrates:', error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Validation
        if (!formData.strain_code || !formData.substrate_id) {
            alert('Please select both strain and substrate');
            return;
        }

        if (formData.baglet_count < APP_CONFIG.MIN_BAGLETS_PER_BATCH) {
            alert(`Minimum baglet count is ${APP_CONFIG.MIN_BAGLETS_PER_BATCH}`);
            return;
        }

        if (formData.baglet_count > APP_CONFIG.MAX_BAGLETS_PER_BATCH) {
            alert(`Maximum baglet count is ${APP_CONFIG.MAX_BAGLETS_PER_BATCH}`);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/batches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                alert(`✅ Batch ${data.batch_id} created successfully with ${data.baglet_count} baglets!`);
                onSuccess();
                onClose();
                // Reset form
                setFormData({
                    strain_code: '',
                    substrate_id: '',
                    prepared_date: new Date().toISOString().split('T')[0],
                    baglet_count: APP_CONFIG.DEFAULT_BAGLET_COUNT,
                    created_by: 'user@example.com',
                });
            } else {
                alert(`❌ Error: ${data.error}`);
            }
        } catch (error: any) {
            console.error('Failed to create batch:', error);
            alert(`❌ Failed to create batch: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-dark-surface border border-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                {/* Header - Sticky */}
                <div className="sticky top-0 bg-dark-surface border-b border-gray-800 px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg sm:text-xl font-semibold text-accent-leaf">Create New Batch</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors text-xl sm:text-2xl"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                    {/* Strain Selection */}
                    <div>
                        <Select
                            key={`strain-${strains.length}`}
                            label="Mushroom Strain *"
                            options={[
                                { value: '', label: '-- Select Strain --' },
                                ...strains.map((strain) => ({
                                    value: strain.strain_code,
                                    label: `${strain.mushroom_name} – ${strain.strain_code}`,
                                })),
                            ]}
                            value={formData.strain_code}
                            onChange={(e) => setFormData({ ...formData, strain_code: e.target.value })}
                            required
                        />
                        {strains.length === 0 && (
                            <p className="text-xs text-gray-500 mt-1">Loading strains...</p>
                        )}
                    </div>

                    {/* Substrate Selection */}
                    <div>
                        <Select
                            key={`substrate-${substrates.length}`}
                            label="Substrate *"
                            options={[
                                { value: '', label: '-- Select Substrate --' },
                                ...substrates.map((substrate) => ({
                                    value: substrate.substrate_id,
                                    label: substrate.substrate_name,
                                })),
                            ]}
                            value={formData.substrate_id}
                            onChange={(e) => setFormData({ ...formData, substrate_id: e.target.value })}
                            required
                        />
                        {substrates.length === 0 && (
                            <p className="text-xs text-gray-500 mt-1">Loading substrates...</p>
                        )}
                    </div>

                    {/* Prepared Date */}
                    <Input
                        label="Prepared Date *"
                        type="date"
                        value={formData.prepared_date}
                        onChange={(e) => setFormData({ ...formData, prepared_date: e.target.value })}
                        required
                    />

                    {/* Baglet Count */}
                    <div>
                        <Input
                            label={`Baglet Count * (Max: ${APP_CONFIG.MAX_BAGLETS_PER_BATCH})`}
                            type="number"
                            min={APP_CONFIG.MIN_BAGLETS_PER_BATCH}
                            max={APP_CONFIG.MAX_BAGLETS_PER_BATCH}
                            value={formData.baglet_count}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || APP_CONFIG.MIN_BAGLETS_PER_BATCH;
                                setFormData({
                                    ...formData,
                                    baglet_count: Math.min(value, APP_CONFIG.MAX_BAGLETS_PER_BATCH)
                                });
                            }}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Enter between {APP_CONFIG.MIN_BAGLETS_PER_BATCH} and {APP_CONFIG.MAX_BAGLETS_PER_BATCH} baglets
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="w-full sm:flex-1 order-2 sm:order-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full sm:flex-1 order-1 sm:order-2"
                            disabled={loading || strains.length === 0 || substrates.length === 0}
                        >
                            {loading ? 'Creating...' : 'Create Batch'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
