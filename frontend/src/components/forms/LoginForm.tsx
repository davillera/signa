'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import { setAuthToken } from '@/lib/cookies';
import { useState } from 'react';

interface LoginFormInputs {
	email: string;
	password: string;
}

export default function LoginForm() {
	const { register, handleSubmit } = useForm({
		defaultValues: {
			email: "davillera@email.com",
			password: "Xk221ac4",
		},
	});
	const router = useRouter();
	const [error, setError] = useState('');

	const onSubmit = async (data: LoginFormInputs) => {
		try {
			const response = await login(data);
			setAuthToken(response.access_token);
			router.push('/brands');
		} catch (err) {
			setError('Credenciales inválidas');
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-10">
			<div>
				<label className="block text-sm font-medium">Email</label>
				<input
					type="email"
					{...register('email')}
					className="mt-1 w-full border px-3 py-2 rounded"
					required
				/>
			</div>
			<div>
				<label className="block text-sm font-medium">Contraseña</label>
				<input
					type="password"
					{...register('password')}
					className="mt-1 w-full border px-3 py-2 rounded"
					required
				/>
			</div>
			{error && <p className="text-red-500 text-sm">{error}</p>}

			<button
				type="submit"
				className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
			>
				Iniciar sesión
			</button>

			<div className="text-center mt-4">
				<span className="text-sm">¿No tienes cuenta?</span>
				<button
					type="button"
					className="text-blue-600 hover:underline ml-1 text-sm"
					onClick={() => router.push('/register')}
				>
					Regístrate aquí
				</button>
			</div>
		</form>
	);
}
