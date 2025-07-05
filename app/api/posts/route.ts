import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { timestamp: 'desc' },
    include: { user: true },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  try {
    const { content, imageUrl, email } = await req.json();
    if (!content || !email) {
      return NextResponse.json({ error: 'Missing content or user email' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        content,
        ...(imageUrl ? { imageUrl } : {}), // 仅在存在 imageUrl 时添加
        userId: user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
