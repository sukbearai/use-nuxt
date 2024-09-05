import { acceptHMRUpdate, defineStore } from 'pinia'

interface UserInfo {
  name: string
  avatar: string
}

export const useUserInfoListStore = defineStore('user', () => {
  const userInfoList = ref<UserInfo[]>([])

  function setNewUserInfo(userInfo: UserInfo) {
    userInfoList.value.push(userInfo)
  }

  const getUserInfoList = computed(() => userInfoList.value)

  const isExistsCurrentUser = computed(() => userInfoList.value.length > 0)

  return {
    setNewUserInfo,
    getUserInfoList,
    isExistsCurrentUser,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserInfoListStore, import.meta.hot))
