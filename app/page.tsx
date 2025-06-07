"use client"; //客户端组件
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [content, setContent] = useState(""); // 输入框内容
  const [posts, setPosts] = useState<any[]>([]); // 所有帖子
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  // 读取登录状态
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loginStatus === "true");

    // 初始化加载帖子
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  // 发布按钮点击逻辑
  const handlePost = () => {
    const userData = localStorage.getItem("registeredUser");
    if (!userData) return;
    const { email } = JSON.parse(userData);

    
  
    const newPost = {
      email,
      content,
      timestamp: new Date().toLocaleString(),
      imageUrl: imagePreview || null, // 加入图片字段
    };
  
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  
    // 清空输入
    setContent("");
    setImageFile(null);
    setImagePreview(null);
  };
    //Delete buttom
  const handleDelete = (index: number) => {
    const updated = [...posts];
    updated.splice(index, 1);
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
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

          <input   //image loader 图片上传功能
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
                reader.readAsDataURL(file); // 把图片转为 base64
              }
            }}
            className="mb-5"
          />
          {imagePreview && (
            <div className="mb-10">
              <img src={imagePreview} alt="预览图" className="max-h-40 rounded" />
            </div>
          )}
          <div className="flex justify-end"></div>
          <button
            onClick={handlePost}
            className="bg-blue-600 text-white px-11 py-2 rounded hover:bg-blue-800"
            disabled={!content.trim()}
          >
            发布
          </button>
        </div>
      ) : (  //If else 
        <p className="text-red-600 mb-4">⚠️ Please Login to publish content </p>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500">No Activity</p>
        ) : (
          posts.map((post, index) => {
            const loginStatus = localStorage.getItem("isLoggedIn") === "true";
            const userData = loginStatus ? localStorage.getItem("registeredUser") : null;
            const currentEmail = userData ? JSON.parse(userData).email : null;
            const isOwner = loginStatus && currentEmail === post.email;

          
            return (
              <div key={index} className="border p-3 rounded shadow">
                <p className="text-sm text-gray-500">{post.email} · {post.timestamp}</p>
                <p className="mt-1 whitespace-pre-line">{post.content}</p>
          
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="uploadedimages" className="mt-2 max-h-60 rounded" />
                )}
          
                {isOwner && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:underline"
                    >
                      删除
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
