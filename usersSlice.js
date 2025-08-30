import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  users: [
    {
      id: "1",
      name: "Bisma Aslam",
      email: "bismalam300@gmail.com",
      profilePicture:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-07-27%20at%205.29.00%20PM-wjiZc0aMxkCi1QyV52NpAbHovc64d6.jpeg", // Updated to new picture
      bio: "Hello, I'm Bisma! Welcome to Social Connect! 🌟",
    },
    {
      id: "2",
      name: "Maria",
      email: "maria@example.com",
      profilePicture: null,
      bio: "Love connecting with new people! Nature enthusiast 🌿💫",
    },
    {
      id: "3",
      name: "Ali",
      email: "ali@example.com",
      profilePicture: null,
      bio: "Book lover and mindfulness enthusiast 📚🧘‍♂️",
    },
    {
      id: "4",
      name: "Hassan",
      email: "hassan@example.com",
      profilePicture: null,
      bio: "Coffee lover ☕️ | Freelance designer | Always exploring new places ✨",
    },
    {
      id: "5",
      name: "Fatima",
      email: "fatima@example.com",
      profilePicture: null,
      bio: "Adventure seeker 🏔️ | Photographer | Living life one hike at a time 📸",
    },
  ],
  loading: false,
  error: null,
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload)
    },
    updateUser: (state, action) => {
      const { id, ...updates } = action.payload
      const userIndex = state.users.findIndex((user) => user.id === id)
      if (userIndex > -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...updates }
      }
    },
    setUsers: (state, action) => {
      state.users = action.payload
    },
  },
})

export const { addUser, updateUser, setUsers } = usersSlice.actions
export default usersSlice.reducer
