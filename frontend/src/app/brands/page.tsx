'use client';

import { useEffect, useState } from 'react';
import { getAllBrands } from '@/services/brandService';
import BrandList from '@/components/brands/BrandList';
import CreateBrandModal from '@/components/brands/CreateBrandModal';

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
	const [error, setError] = useState('');
	const [showCreateModal, setShowCreateModal] = useState(false);

	const refreshBrands = async () => {
		try {
			setLoading(true);
			const data = await getAllBrands();
			setBrands(data);
		} catch (err) {
			setError('Error al cargar las marcas');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshBrands();
	}, []);

	if (loading) return <p className="p-4">Cargando marcas...</p>;
	if (error) return <p className="p-4 text-red-500">{error}</p>;

	return (
		<main className="p-8">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Lista de Marcas</h1>
				<button
					className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
					onClick={() => setShowCreateModal(true)}
				>
					+ Nueva Marca
				</button>
			</div>
			<BrandList brands={brands} onChanged={refreshBrands} />

			{showCreateModal && (
				<CreateBrandModal
					onClose={() => setShowCreateModal(false)}
					onSuccess={refreshBrands}
				/>
			)}
		</main>
	);
}
