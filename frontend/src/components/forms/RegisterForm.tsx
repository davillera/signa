'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { register as registerUser } from '@/services/authService';
import { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

type RegisterFormInputs = {
	email: string;
	password: string;
	confirmPassword: string;
};

export default function RegisterForm() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormInputs>({ mode: 'onBlur' });

	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const password = watch('password');

	const onSubmit = async (data: RegisterFormInputs) => {
		setError(null);
		try {
			await registerUser({ email: data.email, password: data.password });
			setSuccess(true);
			// Redirige al login mostrando confirmación
			setTimeout(() => router.push('/login?registered=1'), 1200);
		} catch {
			setError('No pudimos crear tu cuenta. Inténtalo nuevamente.');
		}
	};

	useEffect(() => {
		if (success) {
			// Limpio posibles errores si acaba de salir todo bien
			setError(null);
		}
	}, [success]);

	return (
		<div className="mx-auto w-full max-w-md">
			<div className="rounded-2xl bg-white/80 shadow-xl ring-1 ring-black/5 backdrop-blur p-6 sm:p-8">
				<h1 className="text-2xl font-semibold tracking-tight">Crear cuenta</h1>
				<p className="mt-1 text-sm text-gray-600">Regístrate para empezar a gestionar tus marcas.</p>

				{success && (
					<div className="mt-4 flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
						<CheckCircleIcon className="h-5 w-5 flex-none" />
						<span>Cuenta creada con éxito. Te redirigiremos al inicio de sesión…</span>
					</div>
				)}

				{error && (
					<div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
						<ExclamationTriangleIcon className="h-5 w-5 flex-none" />
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
					<div className="grid gap-1.5">
						<label htmlFor="email" className="text-sm font-medium text-gray-700">
							Correo electrónico
						</label>
						<input
							id="email"
							type="email"
							{...register('email', {
								required: 'El correo es obligatorio',
								pattern: { value: /\S+@\S+\.\S+/, message: 'Correo no válido' },
							})}
							className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600 ${
								errors.email ? 'border-red-400' : 'border-gray-300'
							}`}
							placeholder="tu@correo.com"
							autoComplete="email"
						/>
						{errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
					</div>

					<div className="grid gap-1.5">
						<label htmlFor="password" className="text-sm font-medium text-gray-700">
							Contraseña
						</label>
						<div className="relative">
							<input
								id="password"
								type={showPassword ? 'text' : 'password'}
								{...register('password', {
									required: 'La contraseña es obligatoria',
									minLength: { value: 8, message: 'Mínimo 8 caracteres' },
								})}
								className={`w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-green-600 ${
									errors.password ? 'border-red-400' : 'border-gray-300'
								}`}
								placeholder="••••••••"
								autoComplete="new-password"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((s) => !s)}
								className="absolute inset-y-0 right-2 grid place-items-center text-gray-500"
								aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
							>
								{showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
							</button>
						</div>
						{errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}
					</div>

					<div className="grid gap-1.5">
						<label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
							Confirmar contraseña
						</label>
						<input
							id="confirmPassword"
							type={showPassword ? 'text' : 'password'}
							{...register('confirmPassword', {
								required: 'Debes confirmar tu contraseña',
								validate: (value) => value === password || 'Las contraseñas no coinciden',
							})}
							className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600 ${
								errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
							}`}
							placeholder="••••••••"
							autoComplete="new-password"
						/>
						{errors.confirmPassword && (
							<span className="text-xs text-red-600">{errors.confirmPassword.message as string}</span>
						)}
					</div>

					<button
						type="submit"
						disabled={isSubmitting || success}
						className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
					>
						{isSubmitting && (
							<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
							</svg>
						)}
						{success ? 'Creada' : isSubmitting ? 'Creando…' : 'Registrarse'}
					</button>

					<p className="text-center text-sm text-gray-600">
						¿Ya tienes cuenta?{' '}
						<button type="button" onClick={() => router.push('/login')} className="font-medium text-green-700 hover:underline">
							Inicia sesión
						</button>
					</p>
				</form>
			</div>
		</div>
	);
}
