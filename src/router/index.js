import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/Layout'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Thesis from '@/views/Thesis'
import ThesisList from '@/views/Thesis/List'
import ThesisAdd from '@/views/Thesis/Add'
import Category from '@/views/Category'
import CategoryList from '@/views/Category/List'
import CategoryAdd from '@/views/Category/Add'
import CategoryDetail from '@/views/Category/Detail'
import Profile from '@/views/Profile'
import Admin from "@/views/Admin"
import Approve from '@/views/Admin/Approve'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    meta: {
      title: 'Home'
    },
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
          title: 'Home'
        }
      },
      {
        path: '/thesis',
        name: 'Thesis',
        component: Thesis,
        meta: {
          title: 'Thesis'
        },
        redirect: '/thesis/list',
        children: [
          {
            path: 'list',
            name: 'ThesisList',
            component: ThesisList,
            meta: {
              title: 'Thesis List'
            }
          },
          {
            path: 'add',
            name: 'ThesisAdd',
            component: ThesisAdd,
            meta: {
              title: 'Thesis Add'
            }
          }
        ]
      },
      {
        path: '/category',
        name: 'Category',
        component: Category,
        meta: {
          title: 'Category'
        },
        redirect: '/category/list',
        children: [
          {
            path: 'list',
            name: 'CategoryList',
            component: CategoryList,
            meta: {
              title: 'Category List'
            }
          },
          {
            path: 'id',
            name: 'CategoryDetail',
            component: CategoryDetail,
            meta: {
              title: 'Category Detail'
            }
          },
          {
            path: 'add',
            name: 'CategoryAdd',
            component: CategoryAdd,
            meta: {
              title: 'Category Add'
            }
          }
        ]
      },
      {
        path: '/profile',
        name: 'Profile',
        component: Profile
      },
      {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        meta: {
          title: 'Admin'
        },
        redirect: '/admin/approve',
        children: [
          {
            path: 'approve',
            name: 'Approve',
            component: Approve,
            meta: {
              title: 'Approve'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
