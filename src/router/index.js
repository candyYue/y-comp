import { createRouter, createWebHistory } from 'vue-router'
import PageButton from '../views/PageButton.vue'
import LoadingProgress from '../views/LoadingProgress.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: PageButton
  },
  {
    path: '/button',
    name: 'button',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PageButton.vue')
  },
  {
    path: '/loadingprogress',
    name: 'loadingprogress',
    component: LoadingProgress
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
