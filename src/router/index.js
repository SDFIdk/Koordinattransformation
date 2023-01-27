import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'

// eslint-disable-next-line one-var
const Home = () => import('@/views/Home.vue'),
Denmark = () => import('@/views/Denmark.vue'),
Greenland = () => import('@/views/Greenland.vue'),
About = () => import('@/views/About.vue')
const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      default: Home
    }
  },
  {
    path: '/Denmark',
    name: 'Denmark',
    component: Denmark,
    meta: {
      title: 'Denmark'
    }
  },
  {
    path: '/Greenland',
    name: 'Greenland',
    component: Greenland,
    meta: {
      title: 'Greenland'
    }
  },
  {
    path: '/About',
    name: 'About',
    component: About,
    meta: {
      title: 'About'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  base: '/',
  routes,
  scrollBehavior (to, from, savedPosition) {
    let ret = { left: 0, top: 0, behavior: 'smooth' }
    nextTick(() => {
      if (to.hash) {
        ret = { el: to.hash.substring(1), behavior: 'smooth' }
        document?.getElementById(ret.el)?.scrollIntoView(true)
        return { el: to.hash, behavior: 'smooth' }
      } else if (savedPosition) {
        ret = savedPosition
      }
      window.scrollTo(ret)
      return ret
    })
  }
})
export default router
