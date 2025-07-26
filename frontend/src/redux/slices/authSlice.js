import { createSlice } from '@reduxjs/toolkit';

// Initial mock users
const initialUsers = [
  { id: "user1", name: "John Doe", email: "john@example.com", role: "user", password: "pass123" },
  { id: "user2", name: "Jane Smith", email: "jane@example.com", role: "admin", password: "pass123" },
];

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: null, 
    token: null,
    users: initialUsers // Add users to the state
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    addUser: (state, action) => {
      state.users.push(action.payload); // Add new user to the users array
    },
  },
});

export const { login, logout, addUser } = authSlice.actions;
export default authSlice.reducer;