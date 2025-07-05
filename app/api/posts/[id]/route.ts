import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//  放在这里
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
        imageUrl,
        userId: user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    console.error('❌ Create post error:', error); // 打印详细错误
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// 原 DELETE 方法保留在这里
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const postId = parseInt(params.id);
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing user email' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
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

