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
	const [form, setForm] = useState({
		full_name: brand.full_name,
		email: brand.email,
		phone_number: brand.phone_number,
		brand_name: brand.brand_name,
		owner_cedula: brand.owner_cedula,
	});
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
		const formData = new FormData();
		formData.append('full_name', form.full_name);
		formData.append('email', form.email);
		formData.append('phone_number', form.phone_number);
		formData.append('brand_name', form.brand_name);
		formData.append('owner_cedula', form.owner_cedula);
		if (selectedFile) formData.append('logo', selectedFile);

		try {
			await updateBrand(brand.id, formData);
			onSuccess?.();
			onClose();
		} catch (error) {
			console.error('Error updating brand', error);
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4"
			role="dialog"
			aria-modal="true"
		>
			<div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
				<div className="p-6">
					<h2 className="text-xl font-semibold tracking-tight mb-2">Editar Marca</h2>

					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Logo */}
						<div className="flex flex-col items-center gap-3">
							{previewUrl ? (
								<img src={previewUrl} alt="Vista previa del logo" className="w-24 h-24 object-contain rounded-md" />
							) : (
								<div className="w-24 h-24 rounded-md bg-gray-100 grid place-items-center text-xs text-gray-500">
									Sin logo
								</div>
							)}

							<div className="text-center">
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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
						</div>

						{/* Campos */}
						<div className="space-y-4">
							<div className="grid gap-1.5">
								<label htmlFor="brand_name" className="text-sm font-medium text-gray-700">Nombre de la marca</label>
								<input
									id="brand_name"
									name="brand_name"
									value={form.brand_name}
									onChange={handleChange}
									placeholder="Ej: ACME"
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									required
								/>
							</div>
							<div className="grid gap-1.5">
								<label htmlFor="full_name" className="text-sm font-medium text-gray-700">Nombre del dueño</label>
								<input
									id="full_name"
									name="full_name"
									value={form.full_name}
									onChange={handleChange}
									placeholder="Ej: Daniel Andrés"
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									required
								/>
							</div>
							<div className="grid gap-1.5">
								<label htmlFor="email" className="text-sm font-medium text-gray-700">Correo electrónico</label>
								<input
									id="email"
									type="email"
									name="email"
									value={form.email}
									onChange={handleChange}
									placeholder="correo@dominio.com"
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									required
								/>
							</div>
							<div className="grid gap-1.5">
								<label htmlFor="phone_number" className="text-sm font-medium text-gray-700">Número de teléfono</label>
								<input
									id="phone_number"
									type="tel"
									name="phone_number"
									value={form.phone_number}
									onChange={handleChange}
									placeholder="Ej: 3000000000"
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							<div className="grid gap-1.5">
								<label htmlFor="owner_cedula" className="text-sm font-medium text-gray-700">Cédula del propietario</label>
								<input
									id="owner_cedula"
									name="owner_cedula"
									value={form.owner_cedula}
									onChange={handleChange}
									placeholder="Ej: 10000000"
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						</div>

						<div className="flex justify-end gap-2 pt-2">
							<button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
								Cancelar
							</button>
							<button type="submit" className="px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700">
								Guardar
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
