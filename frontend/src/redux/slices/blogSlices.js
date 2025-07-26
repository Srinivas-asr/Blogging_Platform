import { createSlice } from '@reduxjs/toolkit';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: { blogs: [] }, // Initialize with an empty array
  reducers: {
    addBlog: (state, action) => {
      state.blogs.push(action.payload);
    },
    updateBlog: (state, action) => {
      const index = state.blogs.findIndex((b) => b.id === action.payload.id);
      state.blogs[index] = action.payload;
    },
    deleteBlog: (state, action) => {
      state.blogs = state.blogs.filter((b) => b.id !== action.payload);
    },
    addComment: (state, action) => {
      const blog = state.blogs.find((b) => b.id === action.payload.blogId);
      blog.comments.push(action.payload.comment);
    },
    toggleLike: (state, action) => {
      const blog = state.blogs.find((b) => b.id === action.payload.blogId);
      blog.likes += action.payload.increment ? 1 : -1;
    },
  },
});

export const { addBlog, updateBlog, deleteBlog, addComment, toggleLike } = blogSlice.actions;
export default blogSlice.reducer;