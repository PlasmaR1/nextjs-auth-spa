'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RegisterFormData {
  email: string;
  password: string;
}

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      router.push('/home');
    }
  }, [router]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Success, please login！');
        router.replace('/login'); // 注册完跳登录页
        router.refresh(); 
      } else {
        alert('❌ Failed：' + result.error);
      }
    } catch (error) {
      alert('❌ Error while register');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Please enter email"
          {...register('email', { required: 'The email address cannot be null!' })}
          className="p-2 border rounded"
        />
        {errors.email?.message && (
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Please enter the password"
          {...register('password', {
            required: 'The password cannot be null!',
            minLength: {
              value: 6,
              message: 'At least 6 characters!',
            },
          })}
          className="p-2 border rounded"
        />
        {errors.password?.message && (
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        )}

        {/* 注册按钮 */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
}
