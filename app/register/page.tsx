'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// ✅ 第一步：添加表单字段的类型
interface RegisterFormData {
  email: string;
  password: string;
}

export default function RegisterPage() {
  // ✅ 第二步：告诉 useForm 使用这个类型
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

// 在组件内部添加：
const router = useRouter();

useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      router.push('/home');
    }
  }, [router]);

const onSubmit = (data: RegisterFormData) => {
    localStorage.setItem('registeredUser', JSON.stringify(data));
    alert('Success，please login！');
    router.push('/login');
  };
  


  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

        <div className="bg-blue-500 text-white p-4 rounded">
            Tailwind 是真的！
        </div>


        {/* 邮箱输入框 */}
        <input
          type="email"
          placeholder="Please enter email"
          {...register('email', { required: 'The email address cannot be null!' })}
          className="p-2 border rounded"
        />
        {errors.email?.message && <p className="text-red-500 text-sm">{errors.email?.message}</p>}

        {/* 密码输入框 */}
        <input
          type="password"
          placeholder="please enter the password"
          {...register('password', {
            required: 'The password cannot be null!',
            minLength: {
              value: 6,
            message: 'At least 6 chrarcters!',
           },
          })}
          className="p-2 border rounded"
        />
        {errors.password?.message && <p className="text-red-500 text-sm">{errors.password?.message}</p>}

        {/* 注册按钮 */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Register
        </button>
      </form>
    </div>
  );
}
