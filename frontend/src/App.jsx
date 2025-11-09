import React, { useEffect, useState } from "react";
import axios from "axios";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("date");

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:5000/api/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSort = (criteria) => {
    const sorted = [...posts];
    if (criteria === "votes") sorted.sort((a, b) => b.votes - a.votes);
    else sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPosts(sorted);
    setSortBy(criteria);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8 font-poppins">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Discussions Forum
        </h1>

        <PostForm fetchPosts={fetchPosts} />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Sort by:</h2>
          <select
            className="border rounded-lg px-2 py-1"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="votes">Votes</option>
            <option value="date">Date</option>
          </select>
        </div>

        <PostList posts={posts} fetchPosts={fetchPosts} />
      </div>
    </div>
  );
};

export default App;
