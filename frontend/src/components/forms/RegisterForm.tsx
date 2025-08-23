'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { register as registerUser } from '@/services/authService';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

interface RegisterFormInputs {
	email: string;
	password: string;
	confirmPassword: string;
}

export default function RegisterForm() {
	const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>();
	const router = useRouter();
	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const password = watch('password');

	const onSubmit = async (data: RegisterFormInputs) => {
		if (data.password !== data.confirmPassword) {
			setError('Las contraseñas no coinciden');
			return;
		}

		try {
			await registerUser({ email: data.email, password: data.password });
			router.push('/login');
		} catch (err) {
			setError('Error al registrar');
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-10">
			<div>
				<label className="block text-sm font-medium">Email</label>
				<input
					type="email"
					{...register('email', { required: true })}
					className="mt-1 w-full border px-3 py-2 rounded"
				/>
				{errors.email && <p className="text-red-500 text-sm">El email es obligatorio</p>}
			</div>

			<div className="relative">
				<label className="block text-sm font-medium">Contraseña</label>
				<input
					type={showPassword ? 'text' : 'password'}
					{...register('password', { required: true })}
					className="mt-1 w-full border px-3 py-2 rounded pr-10"
				/>
				<button
					type="button"
					className="absolute right-3 top-[38px]"
					onClick={() => setShowPassword(!showPassword)}
				>
					{showPassword ? (
						<EyeSlashIcon className="h-5 w-5 text-gray-500" />
					) : (
						<EyeIcon className="h-5 w-5 text-gray-500" />
					)}
				</button>
				{errors.password && <p className="text-red-500 text-sm">La contraseña es obligatoria</p>}
			</div>

			<div>
				<label className="block text-sm font-medium">Confirmar contraseña</label>
				<input
					type={showPassword ? 'text' : 'password'}
					{...register('confirmPassword', {
						required: true,
						validate: (value) => value === password || 'Las contraseñas no coinciden',
					})}
					className="mt-1 w-full border px-3 py-2 rounded"
				/>
				{errors.confirmPassword && (
					<p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
				)}
			</div>

			{error && <p className="text-red-500 text-sm">{error}</p>}

			<button
				type="submit"
				className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
			>
				Registrarse
			</button>

			<div className="text-center mt-4">
				<span className="text-sm">¿Ya tienes una cuenta?</span>
				<button
					type="button"
					className="text-green-600 hover:underline ml-1 text-sm"
					onClick={() => router.push('/login')}
				>
					Inicia sesión aquí
				</button>
			</div>
		</form>
	);
}