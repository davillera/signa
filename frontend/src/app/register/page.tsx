import RegisterForm from '@/components/forms/RegisterForm';

export default function RegisterPage() {
	return (
		<main className="min-h-svh bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-white to-sky-50">
			<div className="mx-auto max-w-6xl px-4 py-12">
				<div className="mx-auto max-w-md">
					<RegisterForm />
				</div>
			</div>
		</main>
	);
}
