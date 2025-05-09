import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    token: '',
    isLoggedIn: false
  }),
  getters: {
    getUserName: (state) => state.name,
    isAuthenticated: (state) => state.isLoggedIn
  },
  actions: {
    login(username: string, password: string) {
      // 模拟登录API
      return new Promise((resolve) => {
        setTimeout(() => {
          this.name = username
          this.token = 'mock_token_' + Math.random().toString(36).substring(2)
          this.isLoggedIn = true
          resolve(true)
        }, 300)
      })
    },
    logout() {
      this.name = ''
      this.token = ''
      this.isLoggedIn = false
    }
  }
}) 