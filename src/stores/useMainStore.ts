import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('mainStore', () => {

  const user = ref()
  const token = ref()

  const loading = ref(false)


  const getUser = () => {
    const res = user.value || sessionStorage.getItem('user') || sessionStorage.getItem('user')
    return res ? JSON.parse(res) : false
  }

  const getToken = () => {
    const res = token.value || localStorage.getItem('token') || localStorage.getItem('token')
    return res ? JSON.parse(res) : false
  }

  const setUser = (e: any) => {
    user.value = e
    if (e) sessionStorage.setItem('user', e)
  }
  const setToken = (e: any) => {
    token.value = e
    if (e) sessionStorage.setItem('token', e)
  }

  return { user, token, getUser, getToken, setUser, setToken, loading }

})
