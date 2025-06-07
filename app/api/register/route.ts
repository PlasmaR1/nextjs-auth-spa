import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; //  引入 bcryptjs

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }

  // 检查用户是否已存在
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  //  加密密码
  const hashedPassword = await bcrypt.hash(password, 10);

  // 创建用户
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword, //  存储加密后的密码
    },
  });

  return NextResponse.json({ message: 'User registered successfully', user: { email: newUser.email } });
}
