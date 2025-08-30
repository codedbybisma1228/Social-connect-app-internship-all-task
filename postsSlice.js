import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  posts: [
    {
      id: "1",
      userId: "1",
      userName: "Bisma Aslam",
      userAvatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-07-27%20at%205.29.00%20PM-wjiZc0aMxkCi1QyV52NpAbHovc64d6.jpeg", // Updated to new picture
      content: "Welcome to Social Connect! This is my first post. Excited to connect with everyone! 🌟✨",
      image: null,
      timestamp: new Date().toISOString(),
      likes: ["2", "3"],
      shares: 5,
      comments: [
        {
          id: "1",
          userId: "2",
          userName: "Maria",
          userAvatar: null,
          content: "Welcome to the community, Bisma! 🎉",
          timestamp: new Date().toISOString(),
        },
        {
          id: "2",
          userId: "3",
          userName: "Ali",
          userAvatar: null,
          content: "Great to have you here! Looking forward to your posts 😊",
          timestamp: new Date().toISOString(),
        },
      ],
    },
    {
      id: "2",
      userId: "2",
      userName: "Maria",
      userAvatar: null,
      content: "Beautiful sunset today! Nature never fails to amaze me 🌅 #sunset #nature #peaceful",
      image: null,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: ["1"],
      shares: 2,
      comments: [
        {
          id: "3",
          userId: "1",
          userName: "Bisma Aslam",
          userAvatar:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-07-27%20at%205.29.00%20PM-wjiZc0aMxkCi1QyV52NpAbHovc64d6.jpeg", // Updated to new picture
          content: "Absolutely stunning! 😍",
          timestamp: new Date().toISOString(),
        },
      ],
    },
    {
      id: "3",
      userId: "3",
      userName: "Ali",
      userAvatar: null,
      content:
        "Just finished reading an amazing book! 📚 'The Power of Now' by Eckhart Tolle. Highly recommend it to anyone interested in mindfulness and personal growth. What are you reading lately?",
      image: null,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      likes: ["1", "2"],
      shares: 3,
      comments: [],
    },
    {
      id: "4",
      userId: "4",
      userName: "Hassan",
      userAvatar: null,
      content:
        "Had the most amazing coffee at this new café downtown! ☕️ The latte art was incredible and the atmosphere was so cozy. Perfect place to work or catch up with friends! 💕",
      image: null,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      likes: ["1", "3"],
      shares: 1,
      comments: [],
    },
    {
      id: "5",
      userId: "5",
      userName: "Fatima",
      userAvatar: null,
      content:
        "Weekend hiking adventure! 🏔️ Reached the summit just in time for sunrise. The view was absolutely breathtaking! Sometimes you need to disconnect to truly connect with nature. #hiking #adventure #sunrise",
      image: null,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      likes: ["1", "2", "4"],
      shares: 4,
      comments: [],
    },
  ],
  loading: false,
  error: null,
}

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      const newPost = {
        ...action.payload,
        shares: 0,
        comments: [],
      }
      state.posts.unshift(newPost)
    },
    deletePost: (state, action) => {
      const { postId } = action.payload
      state.posts = state.posts.filter((post) => post.id !== postId)
    },
    toggleLike: (state, action) => {
      const { postId, userId } = action.payload
      const post = state.posts.find((p) => p.id === postId)
      if (post) {
        const likeIndex = post.likes.indexOf(userId)
        if (likeIndex > -1) {
          post.likes.splice(likeIndex, 1)
        } else {
          post.likes.push(userId)
        }
      }
    },
    incrementShare: (state, action) => {
      const { postId } = action.payload
      const post = state.posts.find((p) => p.id === postId)
      if (post) {
        post.shares = (post.shares || 0) + 1
      }
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload
      const post = state.posts.find((p) => p.id === postId)
      if (post) {
        if (!post.comments) {
          post.comments = []
        }
        post.comments.push(comment)
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { addPost, deletePost, toggleLike, incrementShare, addComment, setPosts, setLoading, setError } =
  postsSlice.actions
export default postsSlice.reducer

