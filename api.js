// Mock API service - replace with actual API calls
class ApiService {
  constructor() {
    this.baseURL = "https://api.socialconnect.com" // Replace with your API URL
  }

  async login(email, password) {
    // Mock login
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: "1",
            email,
            name: "John Doe",
            profilePicture: null,
            bio: "Hello, I'm new to Social Connect!",
          },
        })
      }, 1000)
    })
  }

  async signup(userData) {
    // Mock signup
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: Date.now().toString(),
            ...userData,
            profilePicture: null,
            bio: "Hello, I'm new to Social Connect!",
          },
        })
      }, 1000)
    })
  }

  async getPosts() {
    // Mock get posts
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          posts: [],
        })
      }, 1000)
    })
  }

  async createPost(postData) {
    // Mock create post
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          post: {
            id: Date.now().toString(),
            ...postData,
            timestamp: new Date().toISOString(),
            likes: [],
            comments: [],
          },
        })
      }, 1000)
    })
  }
}

export default new ApiService()
