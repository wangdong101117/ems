// 进行 axios 自定义插件的制作
import axios from 'axios'
// 创建一个插件对象
var myaxios = {}
// 添加一个方法
myaxios.install = function (Vue){
  // 统一设置axios发送请求的接口基准地址
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  // 设置一个拦截器, 给除了 login路由外的所有请求的请求头 加上 token
  axios.interceptors.request.use(function (config) {
    // config 内保存了所有请求的参数, 其中 config.url就是当前请求的 路由
    if (config.url !== 'login'){
      // 统一给请求头 加上 token
      axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('token')
    }
    // 必须写，需要将修改后的请求对象更新
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  })

  // 将 axios 作为实例方法添加到Vue中
  Vue.prototype.$http = axios //将来写完以后,如果要使用 axios, 可以使用 this.$http来使用
}

// 最后进行导出:
export default myaxios
