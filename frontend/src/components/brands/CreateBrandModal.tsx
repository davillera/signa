'use client';

import { useRef, useState } from 'react';
import { createBrand } from '@/services/brandService';

type Props = {
	onClose: () => void;
	onSuccess?: () => void;
};

export default function CreateBrandModal({ onClose, onSuccess }: Props) {
	const [form, setForm] = useState({
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
			Object.entries(form).forEach(([key, value]) => {
				formData.append(key, value);
			});
			if (selectedFile) {
				formData.append('logo', selectedFile);
			}

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
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<h2 className="text-lg font-bold mb-4">Crear Nueva Marca</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					{previewUrl && (
						<img src={previewUrl} alt="Preview" className="w-24 h-24 object-contain mx-auto" />
					)}

					<div className="text-center">
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="text-blue-600 hover:underline text-sm"
							disabled={loading}
						>
							Seleccionar imagen
						</button>
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							ref={fileInputRef}
							className="hidden"
						/>
					</div>

					{Object.entries(form).map(([name, value]) => (
						<input
							key={name}
							name={name}
							value={value}
							onChange={handleChange}
							placeholder={name.replace('_', ' ')}
							className="w-full border px-3 py-2 rounded"
							required
						/>
					))}

					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="text-gray-600 hover:underline"
							disabled={loading}
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
							disabled={loading}
						>
							{loading ? 'Creando...' : 'Crear'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}