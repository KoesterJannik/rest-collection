'use client';
import { getUserDetails } from '@/api/auth';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import React, { useEffect } from 'react';

function useSession() {
  const {
    data: user,
    isLoading,
    isError,
    remove: logout,
    refetch: reloadUserData,
  } = useQuery(['user'], getUserDetails, {
    retry: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isError && user) {
      console.log(user);
    } else if (isError) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [user, isLoading, isError]);

  return { user: user?.data, isLoading, isError, reloadUserData, logout };
}

export default useSession;
