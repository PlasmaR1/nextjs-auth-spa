import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;
const ADMIN_EMAIL = 'zachzou@foxmail.com';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  let payload: any;

  try {
    payload = verify(token, SECRET);
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }

  if (payload.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const posts = await prisma.post.findMany({
    where: { approved: false },
    include: { user: true },
    orderBy: { timestamp: 'desc' },
  });

  return NextResponse.json(posts);
}
