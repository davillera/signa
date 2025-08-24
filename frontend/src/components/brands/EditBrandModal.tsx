'use client';

import { useRef, useState } from 'react';
import { updateBrand } from '@/services/brandService';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type Brand = {
	full_name: string;
	email: string;
	phone_number: string;
	brand_name: string;
	owner_cedula: string;
	logo_url: string | null;
	id: string;
};

// Esquema compartido con Create
const schema = z.object({
	brand_name: z.string().trim().min(2, 'Ingresa el nombre de la marca'),
	full_name: z.string().trim().min(2, 'Ingresa el nombre del dueño'),
	email: z.string().trim().email('Correo no válido'),
	phone_number: z.string().trim().regex(/^\+?\d{7,10}$/, 'Teléfono no válido (7–10 dígitos, opcional +)'),
	owner_cedula: z.string().trim().regex(/^\d{6,15}$/, 'Cédula no válida (solo dígitos)'),
});
type FormValues = z.infer<typeof schema>;

export default function EditBrandModal({
																				 brand,
																				 onClose,
																				 onSuccess,
																			 }: {
	brand: Brand;
	onClose: () => void;
	onSuccess?: () => void;
}) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(brand.logo_url ?? null);
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: {
			brand_name: brand.brand_name,
			full_name: brand.full_name,
			email: brand.email,
			phone_number: brand.phone_number,
			owner_cedula: brand.owner_cedula,
		},
	});

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		setSelectedFile(file);
		setPreviewUrl(file ? URL.createObjectURL(file) : previewUrl);
	};

	const onSubmit = async (values: FormValues) => {
		setServerError(null);
		const fd = new FormData();
		(Object.keys(values) as (keyof FormValues)[]).forEach((k) => fd.append(k, values[k]));
		if (selectedFile) fd.append('logo', selectedFile);

		try {
			await updateBrand(brand.id, fd);
			onSuccess?.();
			onClose();
		} catch (err) {
			console.error(err);
			setServerError('No se pudo actualizar la marca. Intenta nuevamente.');
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4" role="dialog" aria-modal="true">
			<div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
				<div className="p-6">
					<h2 className="text-xl font-semibold tracking-tight mb-2">Editar Marca</h2>

					{serverError && (
						<div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{serverError}</div>
					)}

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-busy={isSubmitting}>
						{/* Logo */}
						<div className="flex flex-col items-center gap-3">
							{previewUrl ? (
								<img src={previewUrl} alt="Vista previa del logo" className="w-24 h-24 object-contain rounded-md" />
							) : (
								<div className="w-24 h-24 rounded-md bg-gray-100 grid place-items-center text-xs text-gray-500">Sin logo</div>
							)}

							<div className="text-center">
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
									disabled={isSubmitting}
								>
									Cambiar imagen
								</button>
								<input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" disabled={isSubmitting} />
							</div>
						</div>

						{/* Campos */}
						<div className="space-y-4">
							{(
								[
									{ name: 'brand_name', label: 'Nombre de la marca', placeholder: 'Ej: ACME' },
									{ name: 'full_name', label: 'Nombre del dueño', placeholder: 'Ej: Daniel Andrés' },
									{ name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'correo@dominio.com' },
									{ name: 'phone_number', label: 'Número de teléfono', type: 'tel', placeholder: 'Ej: +573000000000' },
									{ name: 'owner_cedula', label: 'Cédula del propietario', placeholder: 'Ej: 10000000' },
								] as const
							).map(({ name, label, type = 'text', placeholder }) => {
								const error = errors[name]?.message as string | undefined;
								return (
									<div key={name} className="grid gap-1.5">
										<label htmlFor={name} className="text-sm font-medium text-gray-700">
											{label}
										</label>
										<input
											id={name}
											type={type}
											placeholder={placeholder}
											{...register(name)}
											aria-invalid={!!error}
											className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
												error ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
											} disabled:bg-gray-50 disabled:text-gray-500`}
											disabled={isSubmitting}
										/>
										{error && <span className="text-xs text-red-600">{error}</span>}
									</div>
								);
							})}
						</div>

						{/* Acciones */}
						<div className="flex justify-end gap-2 pt-2">
							<button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800" disabled={isSubmitting}>
								Cancelar
							</button>
							<button
								type="submit"
								className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
								disabled={!isValid || isSubmitting}
							>
								{isSubmitting && (
									<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
									</svg>
								)}
								{isSubmitting ? 'Guardando…' : 'Guardar'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
