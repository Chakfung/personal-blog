import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Community from '../views/Community.vue'
import Gallery from '../views/Gallery.vue'
import Load from '../views/Load.vue'
import Register from '../views/Register.vue'
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
  },
  {
    path: '/load',
    name: 'Load',
    component: Load
  }
  ,
  {
    path: '/register',
    name: 'Register',
    component: Register
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
