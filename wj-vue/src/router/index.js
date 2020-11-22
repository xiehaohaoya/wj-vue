import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// 导入刚才编写的组件
import AppIndex from '@/components/home/AppIndex'
import Login from '@/components/Login'
import Home from '../components/Home'
import LibraryIndex from '../components/library/LibraryIndex'
import SideMenu from '../components/library/SideMenu'

Vue.use(Router)

export default new Router({
  // 使用history前端路由
  mode: 'history',
  // 下面都是固定的写法
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      redirect: '/index'      
    },
    {
      path: '/home',//浏览器访问路径
      name: 'Home',//页面在项目中的路径
      component: Home,//项目中的组件
      // home页面并不需要被访问
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'AppIndex',
          component: AppIndex,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/library',
          name: 'Library',
          component: LibraryIndex,
          meta: {
            requireAuth: true
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
  ]
})
