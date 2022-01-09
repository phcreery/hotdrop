import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/Gallery').default
    },
    {
      path: '/photos',
      name: 'Photos',
      component: require('@/components/Gallery').default
    },
    {
      path: '/files',
      name: 'Files',
      component: require('@/components/Files').default
    },
    {
      path: '/upload',
      name: 'Upload',
      component: require('@/components/Upload').default
    },
    {
      path: '/settings',
      name: 'Settings',
      component: require('@/components/Settings').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})