import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET!;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const postId = parseInt(params.id);
    const user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.userId !== user.id) {
      return NextResponse.json({ error: 'You are not allowed to delete this post' }, { status: 403 });
    }

    await prisma.post.delete({ where: { id: postId } });
    return NextResponse.json({ message: 'Post deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
