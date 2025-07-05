'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const storedUser = localStorage.getItem('registeredUser'); //  拿 registeredUser
    setIsLoggedIn(!!loggedIn);

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserEmail(user.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('registeredUser'); // 记得登出清 registeredUser
    localStorage.removeItem('userEmail'); //  清除邮箱
  localStorage.removeItem('registeredUser'); // registeredUser清除
    window.location.href = '/login'; // 强制跳回登录

  };

  return (
    <nav className="flex items-center justify-between bg-gray-800 text-white p-4">
      <div className="font-bold text-lg">My SPA</div>
      <div className="flex items-center gap-4">
        <Link href="/">Homepage</Link>
        {isLoggedIn ? (
          <>
            <Link href="/home">My page</Link>
            {userEmail && (
              <span className="text-sm text-gray-300">{userEmail}</span>
            )}
            <button
              onClick={handleLogout}
              className="text-red-300 hover:text-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
