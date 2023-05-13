'use client';
import Link from 'next/link';
import React from 'react';

type Props = {};

function UnAuthNavbar({}: Props) {
  return (
    <nav>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
    </nav>
  );
}

export default UnAuthNavbar;
