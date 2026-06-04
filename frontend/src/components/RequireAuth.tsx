import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import type { ReactNode } from 'react';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { token } = useAuthStore();
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
