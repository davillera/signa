'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
	const router = useRouter();

	return (
		<main className="relative min-h-svh overflow-hidden">
			{/* fondo bonito */}
			<div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-white to-gray-50" />
			<div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(700px_200px_at_50%_-50px,rgba(59,130,246,0.15),transparent)]" />

			<section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center">
				<h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
					Bienvenido al gestor de marcas de <span className="text-red-600">Signaip</span>
				</h1>
				<p className="mt-4 max-w-2xl text-gray-600 text-base sm:text-lg">
					Crea, edita y administra marcas en un solo lugar. Empieza iniciando sesión o creando tu cuenta.
				</p>

				<div className="mt-8 flex flex-col sm:flex-row gap-3">
					<button
						onClick={() => router.push('/login')}
						className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2.5 text-white font-semibold hover:bg-blue-700"
					>
						Iniciar sesión
					</button>
					<button
						onClick={() => router.push('/register')}
						className="inline-flex items-center justify-center rounded-md border border-blue-600 px-6 py-2.5 text-blue-700 font-semibold hover:bg-blue-50"
					>
						Registrarse
					</button>
				</div>
			</section>
		</main>
	);
}
