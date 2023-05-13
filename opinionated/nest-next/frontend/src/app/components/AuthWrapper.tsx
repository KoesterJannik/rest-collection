'use client';
import useSession from '@/hooks/useSession';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Navbar from './Navbar';

type Props = {
  children: React.ReactNode;
};

function AuthWrapper({ children }: Props) {
  const { user, isLoading, isError } = useSession();
  const router = useRouter();
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <pre>{JSON.stringify(user, null, 2)}</pre>
      {children}
    </div>
  );
}

export default AuthWrapper;
