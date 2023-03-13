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
import ShareList from '@/views/Share/ShareList.vue'
import NotFound from "@/views/404"
import UserInfo from "@/views/Profile/UserInfo.vue";
import MySharing from "@/views/Profile/MySharing.vue";
import AddShare from "@/views/Share/AddShare.vue";
import UpdateThesis from "@/views/Thesis/UpdateThesis.vue";
import UpdateShare from "@/views/Share/UpdateShare.vue";
import ApproveShare from "@/views/Share/ApproveShare.vue";
import About from "@/views/Info/About/index.vue";
import TermOfService from "@/views/Info/TermOfService/index.vue";
import PrivacyPolicy from "@/views/Info/PrivacyPolicy/index.vue";
import Maintain from "@/views/Admin/Maintain/index.vue";
import MissingFile from "@/views/Admin/Maintain/MissingFile.vue";
import NoCatThesis from "@/views/Admin/Maintain/NoCatThesis.vue";
import NoCatCat from "@/views/Admin/Maintain/NoCatCat.vue";
import NoChildCat from "@/views/Admin/Maintain/NoChildCat.vue";
import Statistics from "@/views/Statistics/index.vue";

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
        component: Home
      },
      {
        path: '/thesis',
        name: 'Thesis',
        component: Thesis,
        redirect: '/thesis/list',
        children: [
          {
            path: 'list',
            name: 'ThesisList',
            component: ThesisList
          },
          {
            path: 'add',
            name: 'ThesisAdd',
            component: ThesisAdd,
            meta: {
              activeMenu: '/thesis/list'
            }
          },
          {
            path: 'update/:id',
            name: 'UpdateThesis',
            component: UpdateThesis,
            meta: {
              activeMenu: '/thesis/list'
            }
          },
          {
            path: 'upload',
            name: 'AddShare',
            component: AddShare,
            meta: {
              activeMenu: '/thesis/list'
            }
          }
        ]
      },
      {
        path: '/category',
        name: 'Category',
        component: Category,
        redirect: '/category/list',
        children: [
          {
            path: 'list',
            name: 'CategoryList',
            component: CategoryList
          },
          {
            path: 'id',
            name: 'CategoryId',
            redirect: '/category/list'
          },
          {
            path: 'id/:id',
            name: 'CategoryDetail',
            component: CategoryDetail,
            meta: {
              activeMenu: '/category/list'
            }
          },
          {
            path: 'add',
            name: 'CategoryAdd',
            component: CategoryAdd,
            meta: {
              activeMenu: '/category/list'
            }
          }
        ]
      },
      {
        path: '/statistics',
        name: 'Statistics',
        component: Statistics
      },
      {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        redirect: '/profile/UserInfo',
        children: [
          {
            path: 'UserInfo',
            name: 'UserInfo',
            component: UserInfo,
            meta: {
              activeMenu: '/profile'
            }
          },
          {
            path: 'MyUpload',
            name: 'MyUpload',
            component: MySharing,
            meta: {
              activeMenu: '/profile'
            }
          }
        ]
      },
      {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        redirect: '/admin/maintain/MissingFile',
        children: [
          {
            path: 'UploadList',
            name: 'UploadList',
            component: ShareList
          },
          {
            path: 'ApproveUpload/:id',
            name: 'ApproveUpload',
            component: ApproveShare,
            meta: {
              activeMenu: '/admin/UploadList'
            }
          },
          {
            path: 'maintain',
            name: 'Maintain',
            component: Maintain,
            redirect: '/admin/maintain/MissingFile',
            children: [
              {
                path: 'MissingFile',
                name: 'MissingFile',
                component: MissingFile,
                meta: {
                  activeMenu: '/admin/maintain'
                }
              },
              {
                path: 'NoCatThesis',
                name: 'NoCatThesis',
                component: NoCatThesis,
                meta: {
                  activeMenu: '/admin/maintain'
                }
              },
              {
                path: 'NoCatCat',
                name: 'NoCatCat',
                component: NoCatCat,
                meta: {
                  activeMenu: '/admin/maintain'
                }
              },
              {
                path: 'EmptyCat',
                name: 'NoChildCat',
                component: NoChildCat,
                meta: {
                  activeMenu: '/admin/maintain'
                }
              }
            ]
          }
        ]
      },
      {
        path: 'UpdateUpload/:id',
        name: 'UpdateUpload',
        component: UpdateShare,
        meta: {
          activeMenu: '/thesis/list'
        }
      },
      {
        path: '/about',
        name: 'About',
        component: About,
        meta: {
          activeMenu: '/'
        }
      },
      {
        path: '/TermOfService',
        name: 'TermOfService',
        component: TermOfService,
        meta: {
          activeMenu: '/'
        }
      },
      {
        path: '/PrivacyPolicy',
        name: 'PrivacyPolicy',
        component: PrivacyPolicy,
        meta: {
          activeMenu: '/'
        }
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
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
