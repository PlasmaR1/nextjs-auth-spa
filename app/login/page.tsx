'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      router.push('/home');
    }
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || 'Login failed');
        return;
      }

      // 登录成功存储
      localStorage.setItem('token', result.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('registeredUser', JSON.stringify(result.user));
      localStorage.setItem('userEmail', result.user.email);
      alert('Login successful!');
      
      // refresh 
      router.replace('/home');


        window.location.reload();
        
    } catch (err) {
      alert('Server error, try again later');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome to SPA by Zach</h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your Email"
          {...register('email', { required: 'This field is required!' })}
          className="p-2 border rounded"
        />
        {errors.email?.message && <p className="text-red-500 text-sm">{errors.email?.message}</p>}

        {/* Password */}
        <input
          type="password"
          placeholder="Enter your Password"
          {...register('password', { required: 'This field is required!' })}
          className="p-2 border rounded"
        />
        {errors.password?.message && <p className="text-red-500 text-sm">{errors.password?.message}</p>}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
