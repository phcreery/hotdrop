import axios from 'axios'

// Create instance called instance
const instance = axios.create({
  baseURL: process.env.APP_BACKEND || `http://localhost:8081`,
  headers: {},
})
export default {
  getPageList: () =>
    instance({
      method: 'GET',
      url: '/pages/',
    }),
  getPageContentBaseUrl: (category, page) => {
    return instance.defaults.baseURL + '/pagecontent/' + category + '/' + page
  },
}