export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/v-screen/data') {
    return navigateTo('/v-screen/data')
  }
})
