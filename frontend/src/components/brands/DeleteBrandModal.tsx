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
		<div
			className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4"
			role="dialog"
			aria-modal="true"
		>
			<div className="w-full max-w-sm rounded-2xl bg-white shadow-xl ring-1 ring-black/5 text-center">
				<div className="p-6">
					<h2 className="text-xl font-semibold mb-2">¿Eliminar marca?</h2>
					<p className="mb-6 text-sm text-gray-700">
						¿Seguro que deseas eliminar <strong>{brand.brand_name}</strong>? Esta acción no se puede deshacer.
					</p>
					<div className="flex justify-center gap-3">
						<button
							onClick={onClose}
							className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
						>
							Cancelar
						</button>
						<button
							onClick={handleDelete}
							className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700"
						>
							Eliminar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
