import { acceptHMRUpdate, defineStore } from 'pinia'
import type { UserInfo } from '~/types/qt'

export const useUserInfoListStore = defineStore('user', () => {
  const userInfoList = ref<UserInfo[]>([])

  function setUserInfoList(list: UserInfo[]) {
    userInfoList.value = list
  }

  const getUserInfoList = computed(() => userInfoList.value)

  const isExistsCurrentUser = computed(() => userInfoList.value.length > 0)

  return {
    setUserInfoList,
    getUserInfoList,
    isExistsCurrentUser,
    userInfoList,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserInfoListStore, import.meta.hot))
