import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;
const ADMIN_EMAIL = 'zachzou@foxmail.com';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
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

  const postId = parseInt(params.id);
  if (isNaN(postId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const updated = await prisma.post.update({
      where: { id: postId },
      data: { approved: true },
    });

    return NextResponse.json({ message: 'Post approved', post: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
