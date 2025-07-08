import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;
const ADMIN_EMAIL = 'zachzou@foxmail.com';

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  let payload: { email: string };

  try {
    payload = verify(token, SECRET) as { email: string };
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }

  if (payload.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const postId = parseInt(context.params.id);
  const updated = await prisma.post.update({
    where: { id: postId },
    data: { approved: true },
  });

  return NextResponse.json({ message: 'Post approved', post: updated });
}
