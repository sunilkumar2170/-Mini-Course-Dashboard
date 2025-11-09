import Post from "../models/Post.js";
import Reply from "../models/Reply.js";

export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.create({ title, content });
  res.json(post);
};

export const getAllPosts = async (req, res) => {
  const posts = await Post.findAll({ order: [["votes", "DESC"]] });
  res.json(posts);
};

export const getPostById = async (req, res) => {
  const post = await Post.findByPk(req.params.id, { include: Reply });
  res.json(post);
};

export const addReply = async (req, res) => {
  const { content, author } = req.body;
  const reply = await Reply.create({ content, author, PostId: req.params.id });
  res.json(reply);
};

export const upvotePost = async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  post.votes += 1;
  await post.save();
  res.json(post);
};
