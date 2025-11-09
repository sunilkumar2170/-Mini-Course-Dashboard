import React, { useState } from "react";
import axios from "axios";

const PostForm = ({ fetchPosts }) => {
  const [form, setForm] = useState({ title: "", content: "", author: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/posts", form);
    setForm({ title: "", content: "", author: "" });
    fetchPosts();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-blue-100 p-4 rounded-xl mb-6 shadow-inner"
    >
      <input
        name="title"
        placeholder="Enter question title"
        value={form.title}
        onChange={handleChange}
        required
        className="w-full p-2 mb-3 rounded-lg border"
      />
      <textarea
        name="content"
        placeholder="Describe your question"
        value={form.content}
        onChange={handleChange}
        required
        className="w-full p-2 mb-3 rounded-lg border"
      />
      <input
        name="author"
        placeholder="Your name"
        value={form.author}
        onChange={handleChange}
        className="w-full p-2 mb-3 rounded-lg border"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Post Question
      </button>
    </form>
  );
};

export default PostForm;
