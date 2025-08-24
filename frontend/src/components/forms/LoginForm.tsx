'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/services/authService';
import { setAuthToken } from '@/lib/cookies';
import { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

type LoginFormInputs = { email: string; password: string };

export default function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormInputs>({
		defaultValues: { email: '', password: '' },
		mode: 'onBlur',
	});

	const router = useRouter();
	const search = useSearchParams();
	const [error, setError] = useState<string | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (search.get('registered') === '1' || search.get('created') === '1') {
			setSuccessMsg('¡Tu cuenta fue creada con éxito! Ahora inicia sesión.');
		}
	}, [search]);

	const onSubmit = async (data: LoginFormInputs) => {
		setError(null);
		try {
			const response = await login(data);
			setAuthToken(response.access_token);
			router.push('/brands');
		} catch {
			setError('Correo o contraseña inválidos.');
		}
	};

	return (
		<div className="mx-auto w-full max-w-md">
			<div className="rounded-2xl bg-white/80 shadow-xl ring-1 ring-black/5 backdrop-blur p-6 sm:p-8">
				<h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
				<p className="mt-1 text-sm text-gray-600">Accede a tu cuenta para gestionar tus marcas.</p>

				{successMsg && (
					<div className="mt-4 flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
						<CheckCircleIcon className="h-5 w-5 flex-none" />
						<span>{successMsg}</span>
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
							{...register('email', { required: 'El correo es obligatorio' })}
							className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
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
								{...register('password', { required: 'La contraseña es obligatoria' })}
								className={`w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.password ? 'border-red-400' : 'border-gray-300'
								}`}
								autoComplete="current-password"
								placeholder="••••••••"
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

					<button
						type="submit"
						disabled={isSubmitting}
						className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
					>
						{isSubmitting && (
							<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
							</svg>
						)}
						{isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
					</button>

					<p className="text-center text-sm text-gray-600">
						¿No tienes cuenta?{' '}
						<button type="button" onClick={() => router.push('/register')} className="font-medium text-blue-700 hover:underline">
							Regístrate
						</button>
					</p>
				</form>
			</div>
		</div>
	);
}
