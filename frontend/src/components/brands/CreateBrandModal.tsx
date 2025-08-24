'use client';

import { useRef, useState } from 'react';
import { createBrand } from '@/services/brandService';

type Props = {
	onClose: () => void;
	onSuccess?: () => void;
};

type FormState = {
	full_name: string;
	email: string;
	phone_number: string;
	brand_name: string;
	owner_cedula: string;
};

const FIELDS: { name: keyof FormState; label: string; type?: string; autoComplete?: string; placeholder?: string }[] = [
	{ name: 'brand_name', label: 'Nombre de la marca', placeholder: 'Ej: ACME' },
	{ name: 'full_name', label: 'Nombre del dueño', placeholder: 'Ej: Daniel Andrés' },
	{ name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email', placeholder: 'correo@dominio.com' },
	{ name: 'phone_number', label: 'Número de teléfono', type: 'tel', autoComplete: 'tel', placeholder: 'Ej: 3000000000' },
	{ name: 'owner_cedula', label: 'Cédula del propietario', placeholder: 'Ej: 10000000' },
];

export default function CreateBrandModal({ onClose, onSuccess }: Props) {
	const [form, setForm] = useState<FormState>({
		full_name: '',
		email: '',
		phone_number: '',
		brand_name: '',
		owner_cedula: '',
	});
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
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
		if (loading) return;

		setLoading(true);
		try {
			const formData = new FormData();
			(Object.keys(form) as (keyof FormState)[]).forEach((key) => {
				formData.append(key, form[key]);
			});
			if (selectedFile) formData.append('logo', selectedFile);

			await createBrand(formData);
			onSuccess?.();
			onClose();
		} catch (error) {
			console.error('Error creating brand:', error);
		} finally {
			setLoading(false);
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
					<h2 className="text-xl font-semibold tracking-tight mb-2">Crear Nueva Marca</h2>

					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Selector de logo */}
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
									disabled={loading}
								>
									{previewUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}
								</button>
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="hidden"
								/>
							</div>
						</div>

						{/* Campos */}
						<div className="space-y-4">
							{FIELDS.map(({ name, label, type = 'text', autoComplete, placeholder }) => (
								<div key={name} className="grid gap-1.5">
									<label htmlFor={name} className="text-sm font-medium text-gray-700">
										{label}
									</label>
									<input
										id={name}
										name={name}
										type={type}
										value={form[name]}
										onChange={handleChange}
										placeholder={placeholder}
										autoComplete={autoComplete}
										required={['brand_name', 'full_name', 'email'].includes(name)}
										className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							))}
						</div>

						{/* Acciones */}
						<div className="flex justify-end gap-2 pt-2">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
								disabled={loading}
							>
								Cancelar
							</button>
							<button
								type="submit"
								className="px-4 py-2 text-sm font-semibold rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
								disabled={loading}
							>
								{loading ? 'Creando…' : 'Crear'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}