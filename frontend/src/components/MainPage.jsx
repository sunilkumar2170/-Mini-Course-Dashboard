import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MainPage.css";

const MainPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [replyContent, setReplyContent] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", author: "Sunil" });

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    const res = await axios.get("http://localhost:5000/api/posts");
    setDiscussions(res.data);
  };

  const handleUpvote = async (id) => {
    await axios.post(`http://localhost:5000/api/posts/${id}/upvote`);
    fetchDiscussions();
  };

  const handleReply = async (id) => {
    if (!replyContent.trim()) return;
    await axios.post(`http://localhost:5000/api/replies`, {
      content: replyContent,
      author: "Sunil",
      PostId: id,
    });
    setReplyContent("");
    setSelectedPostId(null);
    fetchDiscussions();
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return alert("Please fill all fields!");

    await axios.post("http://localhost:5000/api/posts", newPost);
    setNewPost({ title: "", content: "", author: "Sunil" });
    setShowCreateForm(false);
    fetchDiscussions();
  };

  // ✅ Filter & sort discussions
  const filteredDiscussions = discussions
    .filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "recent") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "upvotes") return b.votes - a.votes;
      return 0;
    });

  return (
    <div className="main-container">
      <h1 className="forum-title">💬 Discussion Forum</h1>

      {/* Search, Sort, and Create Post Button */}
      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Search discussions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="recent">📅 Recent</option>
          <option value="upvotes">👍 Most Upvoted</option>
        </select>
        <button className="create-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
          ➕ New Post
        </button>
      </div>

      {/* Create Post Form */}
      {showCreateForm && (
        <form className="create-form" onSubmit={handleCreatePost}>
          <input
            type="text"
            placeholder="Enter title..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            placeholder="Write your question or discussion..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          ></textarea>
          <input
            type="text"
            placeholder="Author name"
            value={newPost.author}
            onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
          />
          <button type="submit" className="post-btn">Post Discussion</button>
        </form>
      )}

      {/* Discussions */}
      {filteredDiscussions.map((post) => (
        <div key={post.id} className="discussion-card">
          <h3>Q: {post.title}</h3>
          <p>{post.content}</p>
          <div className="post-info">
            <span>👤 {post.author}</span>
            <span>🕒 {new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div className="buttons">
            <button onClick={() => handleUpvote(post.id)}>
              👍 Upvote ({post.votes})
            </button>
            <button
              onClick={() =>
                setSelectedPostId(selectedPostId === post.id ? null : post.id)
              }
            >
              💬 View Replies
            </button>
          </div>

          {/* Replies Section */}
          {selectedPostId === post.id && (
            <div className="reply-section">
              <h4>Replies:</h4>
              {post.Replies && post.Replies.length > 0 ? (
                post.Replies.map((r) => (
                  <div key={r.id} className="reply">
                    <p>
                      💭 <strong>{r.author}</strong>: {r.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="no-reply">No replies yet.</p>
              )}
              <div className="reply-input">
                <input
                  type="text"
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <button onClick={() => handleReply(post.id)}>Send</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MainPage;
