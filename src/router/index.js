import { createRouter, createWebHistory } from 'vue-router'
import PageButton from '../views/PageButton.vue'
import { widgetsList } from '../utils/config/siderbar'

const getComponentByName = (name) => {
  // let path = name.split('-').slice(1).join('/')
  return () => import(`../views/Page${name}`)
}
const getChildComp = (list)=>{
  return list.map(item=>{
    return {
      path:item.path,
      component: getComponentByName(item.name),
      name:item.name,
    }
  })
}

const routes = getChildComp(widgetsList)
  // {
  //   path: '/button',
  //   name: 'button',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/PageButton.vue')
  // },

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
