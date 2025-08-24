import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
	return (
		<main className="min-h-svh bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50 via-white to-purple-50">
			<div className="mx-auto max-w-6xl px-4 py-12">
				<div className="mx-auto max-w-md">
					<LoginForm />
				</div>
			</div>
		</main>
	);
}
