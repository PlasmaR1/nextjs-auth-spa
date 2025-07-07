'use client';

import { useEffect, useState } from 'react';

const ADMIN_EMAIL = "zachzou@foxmail.com";

export default function AdminPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [unapprovedPosts, setUnapprovedPosts] = useState<any[]>([]);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');
    setUserEmail(email);

    if (email === ADMIN_EMAIL && token) {
      fetchUnapprovedPosts(token);
    }
  }, []);

  const fetchUnapprovedPosts = async (token: string) => {
    try {
      const res = await fetch('/api/unapproved-posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setUnapprovedPosts(data);
      } else {
        console.error('Expected array but got:', data);
        setUnapprovedPosts([]); // fallback
      }
    } catch (error) {
      console.error('Failed to fetch unapproved posts:', error);
    }
  };

  const approvePost = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/approve/${postId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setUnapprovedPosts(prev => prev.filter(post => post.id !== postId));
      } else {
        const result = await res.json();
        alert(`Approval failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to approve post:', error);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      {userEmail === ADMIN_EMAIL ? (
        <>
          <h1 className="text-2xl font-bold mb-4">🔐 Admin Approval Panel</h1>
          {unapprovedPosts.length === 0 ? (
            <p>No pending posts</p>
          ) : (
            unapprovedPosts.map(post => (
              <div key={post.id} className="border p-4 rounded mb-4 shadow">
                <p className="text-sm text-gray-600">
                  {post.user.email} · {new Date(post.timestamp).toLocaleString()}
                </p>
                <p className="mt-2">{post.content}</p>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="Uploaded" className="mt-2 max-h-60 rounded" />
                )}
                <button
                  onClick={() => approvePost(post.id)}
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            ))
          )}
        </>
      ) : (
        <h1 className="text-xl font-bold">👋 Welcome to my page</h1>
      )}
    </main>
  );
}
