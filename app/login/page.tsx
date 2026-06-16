import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = { title: 'Login' };

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Odu Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your admin account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
