import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth(requiredRole?: string) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CustomJwtPayload | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const token = getCookie('authToken');

    if (!token) {
      router.push('/loginsignup');
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      
      if (requiredRole && decoded.role !== requiredRole) {
        router.push('/dashboard');
        setLoading(false);
        return;
      }

      setUser(decoded);
    } catch (error) {
      router.push('/loginsignup');
    }

    setLoading(false);
  }, [router, requiredRole]);

  return { user, loading };
} 