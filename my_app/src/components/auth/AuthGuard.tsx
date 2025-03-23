'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Parse from 'parse';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const currentUser = Parse.User.current();

    // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
    if (!currentUser) {
      router.push('/login');
    }
  }, [router]);

  // Si l'utilisateur est connecté, affichez les enfants
  return <>{children}</>;
}