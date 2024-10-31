export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path !== '/v-screen/data') {
      return navigateTo('/v-screen/data')
    }
  })