import { Suspense } from 'react';
import LoginForm from '@/components/forms/LoginForm';

function LoginFormSkeleton() {
	return (
		<div className="mx-auto w-full max-w-md">
			<div className="rounded-2xl bg-white/80 shadow-xl ring-1 ring-black/5 backdrop-blur p-6 sm:p-8">
				<div className="h-7 w-40 rounded bg-gray-200 animate-pulse" />
				<div className="mt-2 h-4 w-64 rounded bg-gray-100 animate-pulse" />

				<div className="mt-6 space-y-5">
					<div className="grid gap-1.5">
						<div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
						<div className="h-9 w-full rounded-md bg-gray-100 animate-pulse" />
					</div>
					<div className="grid gap-1.5">
						<div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
						<div className="h-9 w-full rounded-md bg-gray-100 animate-pulse" />
					</div>
					<div className="h-10 w-full rounded-md bg-gray-200 animate-pulse" />
				</div>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<main className="min-h-svh bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50 via-white to-purple-50">
			<div className="mx-auto max-w-6xl px-4 py-12">
				<div className="mx-auto max-w-md">
					<Suspense fallback={<LoginFormSkeleton />}>
						<LoginForm />
					</Suspense>
				</div>
			</div>
		</main>
	);
}
