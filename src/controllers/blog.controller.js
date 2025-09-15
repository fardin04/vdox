import mongoose from "mongoose";
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiRes } from "../utils/ApiRes.js";

// Create a new blog post
 const createBlog = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        throw new ApiError("Blog content is required", 400);
    }

    const newBlog = new Blog({
        content,
        owner: req.user._id,
    });

    await newBlog.save();

    res.status(201).json(new ApiRes(201, newBlog, "Blog created successfully"));
});

// get blogs of the logged-in user

 const getUserBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ owner: req.user._id }).populate('owner', 'username email').exec();
    res.status(200).json(new ApiRes(200, blogs, "User blogs fetched successfully"));
});

// update a blog post
 const updateBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        throw new ApiError("Invalid blog ID", 400);
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError("Blog not found", 404);
    }

    if (blog.owner.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to update this blog", 403);
    }

    if (content) blog.content = content;

    await blog.save();

    res.status(200).json(new ApiRes(200, blog, "Blog updated successfully"));
});

// delete a blog post
 const deleteBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        throw new ApiError("Invalid blog ID", 400);
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError("Blog not found", 404);
    }

    if (blog.owner.toString() !== req.user._id.toString()) {
        throw new ApiError("You are not authorized to delete this blog", 403);
    }

    await blog.remove();

    res.status(200).json(new ApiRes(200, null, "Blog deleted successfully"));
});

export { createBlog, getUserBlogs, updateBlog, deleteBlog };