import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {};

function Navbar({}: Props) {
  const router = useRouter();
  return (
    <nav>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
