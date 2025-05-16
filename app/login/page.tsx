'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const router = useRouter();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      router.push('/home');
    }
  }, [router]);


  const onSubmit = (data: LoginFormData) => {
    const storedUser = localStorage.getItem('registeredUser');
  
    if (!storedUser) {
      alert('Invalied user,Please register！');
      return;
    }
  
    const user = JSON.parse(storedUser);
  
    if (user.email === data.email && user.password === data.password) {
      alert('Login successful！');
      localStorage.setItem('isLoggedIn', 'true');  // Remember login status
      router.push('/home');
      window.location.reload(); //refresh pages to show login details
    } else {
      alert('Wrong Email or Password');
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome to SPA by Zach</h1>

        {/* Email input */}
        <input
          type="email"
          placeholder="Emter your Email"
          {...register('email', { required: 'You cannot leave empty field here!' })}
          className="p-2 border rounded"
        />
        {errors.email?.message && <p className="text-red-500 text-sm">{errors.email?.message}</p>}

        {/* Password input */}
        <input
          type="password"
          placeholder="Emter your Password"
          {...register('password', { required: 'You cannot leave empty field here!' })}
          className="p-2 border rounded"
        />
        {errors.password?.message && <p className="text-red-500 text-sm">{errors.password?.message}</p>}

        {/* Login Button */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}
