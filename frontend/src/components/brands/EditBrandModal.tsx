'use client';

import { useState, useRef } from 'react';
import { updateBrand } from '@/services/brandService';

type Brand = {
	full_name: string;
	email: string;
	phone_number: string;
	brand_name: string;
	owner_cedula: string;
	logo_url: string | null;
	id: string;
};

export default function EditBrandModal({
																				 brand,
																				 onClose,
																				 onSuccess,
																			 }: {
	brand: Brand;
	onClose: () => void;
	onSuccess?: () => void;
}) {
	const [form, setForm] = useState({ ...brand });
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(brand.logo_url ?? null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const formData = new FormData();
			formData.append('full_name', form.full_name);
			formData.append('email', form.email);
			formData.append('phone_number', form.phone_number);
			formData.append('brand_name', form.brand_name);
			formData.append('owner_cedula', form.owner_cedula);
			if (selectedFile) {
				formData.append('logo', selectedFile);
			}

			await updateBrand(brand.id, formData);
			onSuccess?.();
			onClose();
		} catch (error) {
			console.error('Error updating brand', error);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<h2 className="text-lg font-bold mb-4">Editar Marca</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					{previewUrl && (
						<img
							src={previewUrl}
							alt="Logo Preview"
							className="w-24 h-24 object-contain mx-auto"
						/>
					)}

					<div className="text-center">
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="text-blue-600 hover:underline text-sm"
						>
							Cambiar imagen
						</button>
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							ref={fileInputRef}
							className="hidden"
						/>
					</div>

					<input
						name="brand_name"
						value={form.brand_name}
						onChange={handleChange}
						placeholder="Nombre de la marca"
						className="w-full border px-3 py-2 rounded"
						required
					/>
					<input
						name="full_name"
						value={form.full_name}
						onChange={handleChange}
						placeholder="Nombre del dueño"
						className="w-full border px-3 py-2 rounded"
						required
					/>
					<input
						name="email"
						value={form.email}
						onChange={handleChange}
						placeholder="Correo"
						className="w-full border px-3 py-2 rounded"
						required
					/>
					<input
						name="phone_number"
						value={form.phone_number}
						onChange={handleChange}
						placeholder="Celular"
						className="w-full border px-3 py-2 rounded"
					/>
					<input
						name="owner_cedula"
						value={form.owner_cedula}
						onChange={handleChange}
						placeholder="Cédula"
						className="w-full border px-3 py-2 rounded"
					/>

					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="text-gray-600 hover:underline"
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
						>
							Guardar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}