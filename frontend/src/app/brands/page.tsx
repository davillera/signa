'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAllBrands } from '@/services/brandService';
import BrandList from '@/components/brands/BrandList';
import CreateBrandModal from '@/components/brands/CreateBrandModal';
import {
	ArrowPathIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
	PlusIcon,
} from '@heroicons/react/24/solid';

type Brand = {
	full_name: string;
	email: string;
	phone_number: string;
	brand_name: string;
	owner_cedula: string;
	logo_url: string | null;
	id: string;
};

export default function BrandsPage() {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [loading, setLoading] = useState(true);
	const [, setRefreshing] = useState(false);
	const [error, setError] = useState('');
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	const isInitialLoading = loading && brands.length === 0;

	const refreshBrands = async () => {
		try {
			if (brands.length === 0) setLoading(true);
			else setRefreshing(true);
			const data = await getAllBrands();
			setBrands(data);
			setError('');
		} catch (err) {
			setError('Ocurrió un error al cargar las marcas.');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		refreshBrands();
	}, []);

	useEffect(() => {
		if (!successMsg) return;
		const t = setTimeout(() => setSuccessMsg(null), 2500);
		return () => clearTimeout(t);
	}, [successMsg]);

	const skeletons = useMemo(
		() =>
			new Array(6).fill(0).map((_, i) => (
				<div
					key={i}
					className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 animate-pulse"
				>
					<div className="mx-auto mb-4 h-24 w-24 rounded bg-gray-200" />
					<div className="mx-auto mb-2 h-4 w-1/2 rounded bg-gray-200" />
					<div className="mx-auto mb-1 h-3 w-3/4 rounded bg-gray-100" />
					<div className="mx-auto h-3 w-2/3 rounded bg-gray-100" />
				</div>
			)),
		[]
	);

	return (
		<main className="min-h-svh bg-[radial-gradient(900px_300px_at_50%_-100px,rgba(59,130,246,0.07),transparent)]">
			<div className="mx-auto max-w-6xl px-4 py-8">
				{/* Encabezado */}
				<div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
					<h1 className="text-2xl font-bold tracking-tight">Lista de Marcas</h1>

					<div className="flex items-center gap-2">
						<button
							className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
							onClick={() => setShowCreateModal(true)}
						>
							<PlusIcon className="h-4 w-4" />
							Nueva Marca
						</button>
					</div>
				</div>

				{/* Banner éxito */}
				{successMsg && (
					<div
						className="mb-4 flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800"
						aria-live="polite"
					>
						<CheckCircleIcon className="h-5 w-5 flex-none" />
						<span>{successMsg}</span>
					</div>
				)}

				{/* Alerta error */}
				{error && (
					<div className="mb-4 flex items-start justify-between gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
						<div className="flex items-start gap-2">
							<ExclamationTriangleIcon className="h-5 w-5 flex-none" />
							<span>{error}</span>
						</div>
						<button
							onClick={refreshBrands}
							className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
						>
							Reintentar
						</button>
					</div>
				)}

				{/* Contenido */}
				{isInitialLoading ? (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{skeletons}</div>
				) : brands.length === 0 ? (
					<div className="rounded-xl border bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
						<p className="text-base text-gray-700">Aún no tienes marcas.</p>
						<p className="mt-1 text-sm text-gray-500">Crea tu primera marca para comenzar.</p>
						<button
							onClick={() => setShowCreateModal(true)}
							className="mt-5 inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
						>
							<PlusIcon className="h-4 w-4" />
							Crear marca
						</button>
					</div>
				) : (
					<BrandList brands={brands} onChanged={refreshBrands} />
				)}
			</div>

			{showCreateModal && (
				<CreateBrandModal
					onClose={() => setShowCreateModal(false)}
					onSuccess={() => {
						setShowCreateModal(false);
						refreshBrands();
						setSuccessMsg('¡Marca creada correctamente!');
					}}
				/>
			)}
		</main>
	);
}