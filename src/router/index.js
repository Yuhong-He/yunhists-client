import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/Layout'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Thesis from '@/views/Thesis'
import ThesisList from '@/views/Thesis/ThesisList.vue'
import ThesisAdd from '@/views/Thesis/AddThesis.vue'
import Category from '@/views/Category'
import CategoryList from '@/views/Category/CategoryList.vue'
import CategoryAdd from '@/views/Category/AddCategory.vue'
import CategoryDetail from '@/views/Category/CategoryDetail.vue'
import Profile from '@/views/Profile'
import Admin from "@/views/Admin"
import Approve from '@/views/Share/ApproveList.vue'
import Test from "@/views/Test"
import NotFound from "@/views/404"
import UserInfo from "@/views/Profile/UserInfo.vue";
import MySharing from "@/views/Profile/MySharing.vue";
import Share from "@/views/Share/UserShare.vue";
import UpdateThesis from "@/views/Thesis/UpdateThesis.vue";

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
              title: 'Add Thesis',
              activeMenu: '/thesis/list'
            }
          },
          {
            path: 'update/:id',
            name: 'UpdateThesis',
            component: UpdateThesis,
            meta: {
              title: 'Update Thesis',
              activeMenu: '/thesis/list'
            }
          },
          {
            path: 'share',
            name: 'Share',
            component: Share,
            meta: {
              title: 'Share Thesis',
              activeMenu: '/thesis/list'
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
            redirect: '/category/list'
          },
          {
            path: 'id/:id',
            name: 'CategoryDetail',
            component: CategoryDetail,
            meta: {
              title: 'Category Detail',
              activeMenu: '/category/list'
            }
          },
          {
            path: 'add',
            name: 'CategoryAdd',
            component: CategoryAdd,
            meta: {
              title: 'Add Category',
              activeMenu: '/category/list'
            }
          }
        ]
      },
      {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: {
          title: 'Profile',
        },
        redirect: '/profile/userInfo',
        children: [
          {
            path: 'userInfo',
            name: 'UserInfo',
            component: UserInfo,
            meta: {
              title: 'User Info',
              activeMenu: '/profile'
            }
          },
          {
            path: 'mySharing',
            name: 'MySharing',
            component: MySharing,
            meta: {
              title: 'My Sharing',
              activeMenu: '/profile'
            }
          }
        ]
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
    component: Login,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
    meta: {
      title: 'Test'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
