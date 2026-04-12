// src/pages/LegalPage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LegalPage() {
  const { type } = useParams();
  const [content, setContent] = useState("");

useEffect(() => {
  fetch(`http://localhost:5000/api/legal/${type}`) // لازم يكون PORT السيرفر
    .then(res => res.json())
    .then(data => setContent(data.content))
    .catch(err => console.error(err));
}, [type]);

  return (
    <div style={{ padding: "40px" }}>
      <pre>{content}</pre>
    </div>
  );
}