'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
	const router = useRouter();

	return (
		<div className="min-h-screen flex flex-col justify-center items-center text-center p-6 sm:p-12">

			<h1 className="text-3xl sm:text-4xl font-bold mb-4">
				Bienvenido al gestor de marcas de <span className="text-red-600">Signaip</span>
			</h1>

			<p className="text-gray-600 mb-8 text-base sm:text-lg">
				Por favor, inicia sesión o regístrate para comenzar.
			</p>

			<div className="flex gap-4 flex-col sm:flex-row">
				<button
					onClick={() => router.push('/login')}
					className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
				>
					Iniciar sesión
				</button>
				<button
					onClick={() => router.push('/register')}
					className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 px-6 rounded transition"
				>
					Registrarse
				</button>
			</div>
		</div>
	);
}
