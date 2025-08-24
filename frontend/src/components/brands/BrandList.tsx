'use client';

import { useState } from 'react';
import Image from 'next/image';
import EditBrandModal from './EditBrandModal';
import DeleteBrandModal from './DeleteBrandModal';

type Brand = {
	full_name: string;
	email: string;
	phone_number: string;
	brand_name: string;
	owner_cedula: string;
	logo_url: string | null;
	id: string;
};

export default function BrandList(
	{brands, onChanged}: {
	brands: Brand[];
	onChanged?: any ;
}) {
	const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
	const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{brands.map((brand) => (
					<div
						key={brand.id}
						className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition duration-300"
					>
						{brand.logo_url ? (
							<Image
								src={brand.logo_url}
								alt={`${brand.brand_name} logo`}
								width={100}
								height={100}
								className="object-contain mb-4"
							/>
						) : (
							<div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-200 rounded">
								<span>No Logo</span>
							</div>
						)}

						<h2 className="text-xl font-semibold text-gray-800 mb-1">
							{brand.brand_name}
						</h2>
						<p className="text-sm text-gray-600">Dueño: {brand.full_name}</p>
						<p className="text-sm text-gray-600">Email: {brand.email}</p>
						<p className="text-sm text-gray-600">Celular: {brand.phone_number}</p>
						<p className="text-sm text-gray-600">Cédula: {brand.owner_cedula}</p>

						<div className="mt-4 flex gap-2">
							<button
								onClick={() => setEditingBrand(brand)}
								className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
							>
								Editar
							</button>
							<button
								onClick={() => setDeletingBrand(brand)}
								className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
							>
								Eliminar
							</button>
						</div>
					</div>
				))}
			</div>

			{editingBrand && (
				<EditBrandModal
					brand={editingBrand}
					onClose={() => setEditingBrand(null)}
					onSuccess={onChanged}
				/>
			)}

			{deletingBrand && (
				<DeleteBrandModal
					brand={deletingBrand}
					onClose={() => setDeletingBrand(null)}
					onSuccess={onChanged}
				/>
			)}
		</>
	);
}
