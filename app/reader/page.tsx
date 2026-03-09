"use client";

import { useState } from "react";

export default function ReaderPage() {
  const links = [
    { name: "Reader 1", url: "https://book4.bigwindvi.com/2411/03zyz/index.html" },
    { name: "Reader 2", url: "https://flbook.com.cn/c/RHgbbnyyTG?cckey=7cc9d34a" },
    { name: "Reader 3", url: "https://flbook.com.cn/c/brceB6lVEZ?cckey=fb297376#page/1" }
  ];

  const [current, setCurrent] = useState(links[0].url);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      
      {/* 顶部按钮 */}
      <div style={{ padding: "10px", borderBottom: "1px solid #ccc", display: "flex", gap: "10px" }}>
        {links.map((item, i) => (
          <button key={i} onClick={() => setCurrent(item.url)}>
            {item.name}
          </button>
        ))}
      </div>

      {/* 阅读区域 */}
      <iframe
        src={current}
        style={{ flex: 1, width: "100%", border: "none" }}
      />
    </div>
  );
}