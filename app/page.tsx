"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail");
    setIsLoggedIn(loginStatus);
    setUserEmail(email);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  const handlePost = async () => {
    const token = localStorage.getItem("token");
    if (!token || !content.trim()) return;

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, imageUrl: imagePreview }),
    });

    const result = await res.json();
    if (res.ok) {
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      fetchPosts();
    } else {
      alert("Failed to post: " + result.error);
    }
  };

  const handleDelete = async (postId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    if (res.ok) {
      fetchPosts();
    } else {
      alert("Delete failed: " + result.error);
    }
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🌐 Welcome to the SPA Demo</h1>

      {isLoggedIn ? (
        <div className="mb-6">
          <textarea
            className="w-full border p-2 rounded resize-none mb-2"
            rows={3}
            placeholder="Type Something"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="mb-5"
          />
          {imagePreview && (
            <div className="mb-10">
              <img src={imagePreview} alt="image" className="max-h-40 rounded" />
            </div>
          )}

          <button
            onClick={handlePost}
            className="bg-blue-600 text-white px-11 py-2 rounded hover:bg-blue-800"
            disabled={!content.trim()}
          >
            Post
          </button>
        </div>
      ) : (
        <p className="text-red-600 mb-4">⚠️ Please login </p>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500">Nothing here so far</p>
        ) : (
          posts.map((post) => {
            const isOwner = userEmail === post.user.email;

            return (
              <div key={post.id} className="border p-3 rounded shadow">
                <p className="text-sm text-gray-500">
                  {post.user.email} · {new Date(post.timestamp).toLocaleString()}
                </p>
                <p className="mt-1 whitespace-pre-line">{post.content}</p>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="uploadedimages" className="mt-2 max-h-60 rounded" />
                )}
                {isOwner && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
