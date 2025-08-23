'use client';

import { deleteBrand } from '@/services/brandService';

type Brand = {
	brand_name: string;
	id: string;
};

export default function DeleteBrandModal({
																					 brand,
																					 onClose,
																					 onSuccess,
																				 }: {
	brand: Brand;
	onClose: () => void;
	onSuccess?: () => void;
}) {
	const handleDelete = async () => {
		try {
			await deleteBrand(brand.id);
			onSuccess?.();
			onClose();
		} catch (error) {
			console.error('Error deleting brand', error);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
				<h2 className="text-lg font-bold mb-4">¿Eliminar Marca?</h2>
				<p className="mb-6 text-sm text-gray-700">
					¿Estás seguro que quieres eliminar <strong>{brand.brand_name}</strong>? Esta acción no se
					puede deshacer.
				</p>
				<div className="flex justify-center gap-4">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
					>
						Cancelar
					</button>
					<button
						onClick={handleDelete}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
					>
						Eliminar
					</button>
				</div>
			</div>
		</div>
	);
}