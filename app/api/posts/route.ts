import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;

// 获取所有帖子（不需要认证）
export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { timestamp: 'desc' },
    include: { user: true },
  });
  return NextResponse.json(posts);
}

// 创建帖子（需要认证）
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    let payload: any;
    try {
      payload = verify(token, SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    const { content, imageUrl } = await req.json();
    if (!content) {
      return NextResponse.json({ error: 'Missing content' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        content,
        imageUrl: imageUrl || null,
        userId: user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
