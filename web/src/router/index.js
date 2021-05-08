import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Community from '../views/Community.vue'
import Gallery from '../views/Gallery.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/community',
    name: 'Community',
    component: Community
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
