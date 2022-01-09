import axios from 'axios'

// Create instance called instance
const instance = axios.create({
  baseURL: process.env.VUE_APP_BACKEND || `http://localhost:8081`,
  headers: {},
})
export default {
  getPhotoList: () =>
    instance({
      method: 'GET',
      url: '/photolistsimple/',
    }),
  getPhotoBaseUrl: () => {
    return instance.defaults.baseURL + "/photos/"
  },

  getFileList: () =>
    instance({
      method: 'GET',
      url: '/filelist/',
    }),
  getFileListSimple: () =>
    instance({
      method: 'GET',
      url: '/filelistsimple/',
    }),
  getFileBaseUrl: () => {
    return instance.defaults.baseURL + "/files/"
  },

  getUploadURL: () => {
    return instance.defaults.baseURL + "/upload/"
  },
  UploadFileForm: (filesAsFormData) =>
    instance.post('upload/', filesAsFormData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  
  deleteFile: (file) =>
    instance.delete('delete/', { data: { file: file } }),
  
  downloadFile: (file) =>
    instance({
      method: 'GET',
      url: '/files' + file.replace("%20", " "),
      responseType: 'blob',
    }),

  getConfig: () =>
    instance({
      method: 'GET',
      url: '/config/',
    }),
}