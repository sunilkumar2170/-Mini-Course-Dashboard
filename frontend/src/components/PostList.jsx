import React from "react";
import axios from "axios";

const PostList = ({ posts, fetchPosts }) => {
  const handleUpvote = async (id) => {
    await axios.put(`http://localhost:5000/api/posts/${id}/upvote`);
    fetchPosts();
  };

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          className="border-b border-gray-300 py-3 flex justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold text-blue-700">
              {post.title}
            </h3>
            <p className="text-gray-600">{post.content}</p>
            <p className="text-sm text-gray-500">
              Posted by <span className="font-medium">{post.author}</span>
            </p>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => handleUpvote(post.id)}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              ⬆
            </button>
            <span className="text-gray-700 font-bold">{post.votes}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
