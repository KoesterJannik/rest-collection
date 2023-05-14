import AuthWrapper from '@/app/components/AuthWrapper';
import React from 'react';

type Props = {};

function DashboardRoute({}: Props) {
  return (
    <AuthWrapper>
      <div>Dashboard</div>
    </AuthWrapper>
  );
}

export default DashboardRoute;
