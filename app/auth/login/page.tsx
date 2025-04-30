
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      // Check if there's a stored redirect URL from a previous attempt to access a protected route
      const redirectUrl = sessionStorage.getItem('redirectUrl');
      router.push(redirectUrl || '/dashboard');
      sessionStorage.removeItem('redirectUrl');
    }
  }, [isLoggedIn, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md mx-auto animate-fade-in">
        <LoginForm />
      </div>
    </div>
  );
}
