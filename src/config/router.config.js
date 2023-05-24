// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '在线接口开放平台' },
    redirect: '/home',
    children: [
      // home 主页
      {
        path: '/home',
        name: '主页',
        component: () => import('@/views/home/Home'),
        meta: { title: '主页', icon: 'home', permission: ['home'] }
      },
      // interface manage
      {
        path: '/interface',
        name: 'InterfaceList',
        component: () => import('@/views/interface/InterfaceList'),
        meta: { title: '接口管理', icon: 'global', keepAlive: true, permission: ['interface'] }
      },
      {
        path: '/interface/detail/:id',
        name: 'interfaceDetail',
        hidden: true,
        component: () => import('@/views/interface/detail'),
        meta: { title: '接口详情', icon: 'global', keepAlive: false, permission: ['interface_detail'] }
      },
      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: 'menu.account', icon: 'user', keepAlive: true, permission: ['user'] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: 'menu.account.center', keepAlive: true, permission: ['user'] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true, permission: ['user'] },
            redirect: '/account/settings/detail',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/detail',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: 'account.settings.menuMap.basic', hidden: true, permission: ['user'] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['user']
                }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: 'account.settings.menuMap.custom', hidden: true, keepAlive: true, permission: ['user'] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: 'account.settings.menuMap.binding', hidden: true, keepAlive: true, permission: ['user'] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: {
                  title: 'account.settings.menuMap.notification',
                  hidden: true,
                  keepAlive: true,
                  permission: ['user']
                }
              }
            ]
          },

          // other
          {
            path: '/other',
            name: 'otherPage',
            component: RouteView,
            meta: { title: '其他组件', icon: 'slack', permission: ['dashboard'] },
            redirect: '/other/icon-selector',
            children: [
              {
                path: '/other/icon-selector',
                name: 'TestIconSelect',
                component: () => import('@/views/other/IconSelectorView'),
                meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: ['dashboard'] }
              },
              {
                path: '/other/list',
                component: RouteView,
                meta: { title: '业务布局', icon: 'layout', permission: ['support'] },
                redirect: '/other/list/tree-list',
                children: [
                  {
                    path: '/other/list/tree-list',
                    name: 'TreeList',
                    component: () => import('@/views/other/TreeList'),
                    meta: { title: '树目录表格', keepAlive: true }
                  },
                  {
                    path: '/other/list/edit-table',
                    name: 'EditList',
                    component: () => import('@/views/other/TableInnerEditList'),
                    meta: { title: '内联编辑表格', keepAlive: true }
                  },
                  {
                    path: '/other/list/user-list',
                    name: 'UserList',
                    component: () => import('@/views/other/UserList'),
                    meta: { title: '用户列表', keepAlive: true }
                  },
                  {
                    path: '/other/list/role-list',
                    name: 'RoleList',
                    component: () => import('@/views/other/RoleList'),
                    meta: { title: '角色列表', keepAlive: true }
                  },
                  // {
                  //   path: '/other/list/system-role',
                  //   name: 'SystemRole',
                  //   component: () => import('@/views/role/RoleList'),
                  //   meta: { title: '角色列表2', keepAlive: true }
                  // },
                  {
                    path: '/other/list/permission-list',
                    name: 'PermissionList',
                    component: () => import('@/views/other/PermissionList'),
                    meta: { title: '权限列表', keepAlive: true }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
